import { useEffect, useState, useMemo, createContext, useContext } from 'react'
import mermaid from 'mermaid'
import { ChartBarStacked, Copy, ZoomIn, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import Image from '@/lib/ui/image'


type PictureShowContextType = {
  setPictureShow: (data: {
    picture: { url: string };
    extraButtons?: Array<{ onClick: () => void; icon: React.ReactNode }>;
  }) => void;
};

const PictureShowContext = createContext<PictureShowContextType>({
  setPictureShow: () => {},
});


const svgCodeToBase64 = (svgCode: string): string => {
  try {
    
    if (!svgCode.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgCode = svgCode.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    
    const base64 = btoa(unescape(encodeURIComponent(svgCode)));
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    console.error('Error converting SVG to base64:', e);
    return '';
  }
};

export const svgToPngBase64 = async (svgBase64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img') as HTMLImageElement;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const scale =  10; // Use device pixel ratio or default to 2x for high quality
        
        // Set actual size in memory (scaled up for quality)
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        
        canvas.width = width * scale;
        canvas.height = height * scale;
        
        // Scale back down using CSS for display
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Scale the drawing context so everything draws at higher resolution
        ctx.scale(scale, scale);
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to PNG with high quality
        resolve(canvas.toDataURL('image/png', 1.0));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e: Event | string) => {
      reject(new Error('Failed to load image'));
    };
    img.src = svgBase64;
  });
};

/**
 * Converts SVG base64 data URL to PNG base64 data URL with configurable options
 * @param svgBase64 - SVG data URL (data:image/svg+xml;base64,...)
 * @param options - Configuration options for conversion
 * @returns Promise<string> - PNG data URL (data:image/png;base64,...)
 */
export const convertSvgBase64ToPngBase64 = async (
  svgBase64: string,
  options: {
    scale?: number;
    quality?: number;
    backgroundColor?: string;
  } = {}
): Promise<string> => {
  const { scale = 2, quality = 1.0, backgroundColor } = options;

  return new Promise((resolve, reject) => {
    const img = document.createElement('img') as HTMLImageElement;
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        
        // Get image dimensions
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        
        // Set canvas size with scaling
        canvas.width = width * scale;
        canvas.height = height * scale;
        
        // Set display size
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Scale the drawing context
        ctx.scale(scale, scale);
        
        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Set background color if provided
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }
        
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to PNG with specified quality
        const pngBase64 = canvas.toDataURL('image/png', quality);
        resolve(pngBase64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
    };
    
    img.src = svgBase64;
  });
};

const copyToClipboard = (text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Could not copy text: ', err);
    });
  } else {
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
    document.body.removeChild(textArea);
  }
};

// Function to download content as a file
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleDownloadBase = async (src: string, prompt: string) => {
  try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `iris-diagram`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
  } catch (error) {
      console.error('Download failed:', error)
  }
}

export const PictureShowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pictureShow, setPictureShow] = useState<{
    picture: { url: string };
    extraButtons?: Array<{ onClick: () => void; icon: React.ReactNode }>;
  } | null>(null);

  
  

  return (
    <PictureShowContext.Provider value={{ setPictureShow }}>
      {children}
    </PictureShowContext.Provider>
  );
};


const usePictureShow = () => {
  return useContext(PictureShowContext);
};

export function MessageMermaid(props: { source: string; theme: 'light' | 'dark'; generating?: boolean }) {
  const { source, theme, generating } = props

  const [svgId, setSvgId] = useState('')
  const [svgCode, setSvgCode] = useState('')
  useEffect(() => {
    if (generating) {
      return
    }
    ;(async () => {
      const { id, svg } = await mermaidCodeToSvgCode(source, theme)
      setSvgCode(svg)
      setSvgId(id)
    })()
  }, [source, theme, generating])

  if (generating) {
    
    
    return <Loading />
  }

  return (
    <MermaidSVGPreviewDangerous svgId={svgId} svgCode={svgCode} mermaidCode={source} />
  )
}

export function Loading() {
  return (
    <Card className="inline-flex items-center gap-2 p-2 my-2">
      <CardContent className="flex items-center gap-2 p-2">
        <Loader2 className='animate-spin' />
        <span>Loading...</span>
      </CardContent>
    </Card>
  )
}

export function MermaidSVGPreviewDangerous(props: {
  svgCode: string
  svgId: string
  mermaidCode: string
  className?: string
  generating?: boolean
}) {
  const { svgId, svgCode, mermaidCode, className, generating } = props
  const { t } = useTranslation()
  const { setPictureShow } = usePictureShow()
  
  if (!svgCode.includes('</svg>') || generating) {
    return <Loading />
  }
  
  return (
    <Card
      className={cn('cursor-pointer size-full inset-0 my-2 overflow-hidden group m-0 p-0', className)}
    >
        <SVGPreview generating={generating} xmlCode={svgCode} mermaidCode={mermaidCode} />
    </Card>
  )
}

export function SVGPreview(props: { xmlCode: string; className?: string; generating?: boolean, mermaidCode?: string }) {
  const { xmlCode, className, generating, mermaidCode } = props
  const { setPictureShow } = usePictureShow()
  
  const svgBase64 = useMemo(() => {
    if (!xmlCode.includes('</svg>') || generating) {
      return ''
    }
    
    return svgCodeToBase64(xmlCode)
  }, [xmlCode, generating])
  
  if (generating) {
    return <Loading />
  }

  if (!svgBase64) {
    return <>Error</>
  }
  
  return (
    <Card
      className={cn('cursor-pointer size-full group relative', className)}
      onClick={async () => {
        
        const pngBase64 = await convertSvgBase64ToPngBase64(svgBase64, {
          scale: 3, // Higher resolution for picture show
          quality: 1.0
        })
        setPictureShow({
          picture: { url: pngBase64 },
        })
      }}
    >
        <Image
          src={svgBase64}
          className="object-cover size-full rounded-md"
          width={100}
          height={100}
          aspectRatio="auto"
        />
        
        <div className="absolute flex items-center gap-2 z-50 bottom-2 right-2  opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              const handleZoom = async () => {
                const pngBase64 = await convertSvgBase64ToPngBase64(svgBase64, {
                  scale: 3, // Higher resolution for zoom
                  quality: 1.0
                });
                setPictureShow({
                  picture: { url: pngBase64 },
                });
              };
              handleZoom();
            }}
          >
            <ZoomIn size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(mermaidCode as string);
              toast('copied to clipboard');
            }}
          >
            <Copy size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              const handleDownload = async () => {
                const pngBase64 = await convertSvgBase64ToPngBase64(svgBase64, {
                  scale: 4, // Higher resolution for downloads
                  quality: 1.0
                });
                handleDownloadBase(pngBase64, '');
              };
              handleDownload();
            }}
          >
            <Download size={14}/>
          </Button>
        </div>
    </Card>
  )
}

async function mermaidCodeToSvgCode(source: string, theme: 'light' | 'dark') {
  mermaid.initialize({ theme: theme === 'light' ? 'default' : 'dark' })
  const id = 'mermaidtmp' + Math.random().toString(36).substring(2, 15)
  const result = await mermaid.render(id, source)
  
  
  
  
  return { id, svg: result.svg }
}