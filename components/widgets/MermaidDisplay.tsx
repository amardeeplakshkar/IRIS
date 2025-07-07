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

const svgToPngBase64 = async (svgBase64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = svgBase64;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e: any) => {
      reject(e);
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
      link.download = `iris-diagram.png`
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
  let { xmlCode, className, generating, mermaidCode } = props
  const { setPictureShow } = usePictureShow()
  
  const svgBase64 = useMemo(() => {
    if (!xmlCode.includes('</svg>') || generating) {
      return ''
    }
    
    return svgCodeToBase64(xmlCode)
  }, [xmlCode, generating])
  
  if (!svgBase64) {
    return <Loading />
  }
  
  return (
    <Card
      className={cn('cursor-pointer size-full group relative', className)}
      onClick={async () => {
        
        const pngBase64 = await svgToPngBase64(svgBase64)
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
        
        <div className="absolute flex items-center gap-2 z-50 bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              const handleZoom = async () => {
                const pngBase64 = await svgToPngBase64(svgBase64);
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
                handleDownloadBase(svgBase64, '');
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