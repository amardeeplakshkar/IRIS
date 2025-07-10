import { useEffect, useState, useMemo, createContext, useContext } from 'react'
import mermaid from 'mermaid'
import React from 'react'
import { Copy, ZoomIn, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import Image from '@/lib/ui/image'
import toImg from 'react-svg-to-image'


type PictureShowContextType = {
  setPictureShow: (data: {
    picture: { url: string };
    extraButtons?: Array<{ onClick: () => void; icon: React.ReactNode }>;
  }) => void;
};

const PictureShowContext = createContext<PictureShowContextType>({
  setPictureShow: () => {},
});


export const cleanupMermaidErrorNodes = () => {
  const errorSelectors = [
    '[id^="mermaidError"]',
    '.mermaidTooltip',
    '[class*="mermaid-error"]',
    '[id*="mermaid-error"]',
    'div[style*="color: rgb(255, 0, 0)"]', 
    'div[style*="color:#ff0000"]', 
  ];
  
  errorSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.textContent?.includes('Syntax error') ||
          element.textContent?.includes('mermaid version')) {
        element.remove();
      }
    });
  });
  
  
  const allDivs = document.querySelectorAll('div');
  allDivs.forEach(div => {
    if (div.textContent?.includes('Syntax error in text') &&
        div.textContent?.includes('mermaid version')) {
      div.remove();
    }
  });
};


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

/**
 * Converts SVG code to PNG using react-svg-to-image
 * @param svgCode - SVG code string
 * @param options - Configuration options for conversion
 * @returns Promise<string> - PNG data URL (data:image/png;base64,...)
 */
export const convertSvgToPng = async (
  svgCode: string,
  options: {
    scale?: number;
    quality?: number;
    format?: 'png' | 'webp' | 'jpeg';
  } = {}
): Promise<string> => {
  const { scale = 3, quality = 1.0, format = 'png' } = options;
  
  try {
    // Create a temporary SVG element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgCode;
    const svgElement = tempDiv.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('Invalid SVG code');
    }
    
    // Add a unique ID if it doesn't exist
    if (!svgElement.id) {
      svgElement.id = 'temp-svg-' + Math.random().toString(36).substring(2, 15);
    }
    
    // Temporarily add to DOM
    document.body.appendChild(tempDiv);
    
    try {
      const fileData = await toImg(svgElement.id, 'mermaid-diagram', {
        scale: scale,
        format: format,
        quality: quality,
        download: false,
        ignore: '.ignored'
      });
      
      // Remove from DOM
      document.body.removeChild(tempDiv);
      
      return fileData.dataURL;
    } catch (error) {
      // Remove from DOM in case of error
      document.body.removeChild(tempDiv);
      throw error;
    }
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    throw error;
  }
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


export function MessageMermaid(props: { source: string; theme: 'default' | 'forest' | 'dark' | 'neutral' | 'null'; generating?: boolean }) {
  const { source, theme, generating } = props

  const [svgId, setSvgId] = useState('')
  const [svgCode, setSvgCode] = useState('')
  
  
  useEffect(() => {
    cleanupMermaidErrorNodes();
    mermaid.initialize({
      theme: theme,
      markdownAutoWrap: true,
      suppressErrorRendering: true,
    });
  }, [theme]);

  
  useEffect(() => {
    const cleanup = setInterval(() => {
      cleanupMermaidErrorNodes();
    }, 1000); 

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    if (generating) {
      return
    }
    ;(async () => {
      try {
        cleanupMermaidErrorNodes(); 
        const { id, svg } = await mermaidCodeToSvgCode(source, theme)
        setSvgCode(svg)
        setSvgId(id)
        cleanupMermaidErrorNodes(); 
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        cleanupMermaidErrorNodes(); 
        
        const errorSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
            <rect width="400" height="100" fill="#fee2e2" stroke="#dc2626" stroke-width="1" rx="4"/>
            <text x="200" y="40" text-anchor="middle" fill="#dc2626" font-family="monospace" font-size="14">
              Mermaid Syntax Error
            </text>
            <text x="200" y="65" text-anchor="middle" fill="#7f1d1d" font-family="monospace" font-size="10">
              Please check your diagram syntax
            </text>
          </svg>
        `;
        setSvgCode(errorSvg);
        setSvgId('error-' + Math.random().toString(36).substring(2, 15));
      }
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
  const { svgCode, mermaidCode, className, generating } = props
  
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
        try {
          const pngBase64 = await convertSvgToPng(xmlCode, {
            scale: 3,
            quality: 1.0
          });
          setPictureShow({
            picture: { url: pngBase64 },
          });
        } catch (error) {
          console.error('Failed to convert SVG to PNG:', error);
          toast('Failed to convert image');
        }
      }}
    >
        <Image
          src={svgBase64}
          className="object-cover size-full rounded-md"
          width={100}
          height={100}
          aspectRatio="auto"
        />
        
        <div className="absolute flex items-center gap-2 z-10 bottom-2 right-2  opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              const handleZoom = async () => {
                try {
                  const pngBase64 = await convertSvgToPng(xmlCode, {
                    scale: 3,
                    quality: 1.0
                  });
                  setPictureShow({
                    picture: { url: pngBase64 },
                  });
                } catch (error) {
                  console.error('Failed to convert SVG to PNG:', error);
                  toast('Failed to convert image');
                }
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
                try {
                  handleDownloadBase(svgBase64, '');
                } catch (error) {
                  console.error('Failed to download image:', error);
                  toast('Failed to download image');
                }
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

async function mermaidCodeToSvgCode(source: string, theme: 'default' | 'forest' | 'dark' | 'neutral' | 'null') {
  try {
    cleanupMermaidErrorNodes();
    
    mermaid.initialize({
      theme: theme,
      markdownAutoWrap: true,
      suppressErrorRendering: true, 
    });
    
    const id = 'mermaidtmp' + Math.random().toString(36).substring(2, 15);
    const result = await mermaid.render(id, source);
    
    
    cleanupMermaidErrorNodes();
    
    return { id, svg: result.svg };
  } catch (error) {
    
    cleanupMermaidErrorNodes();
    
    
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
        <rect width="400" height="100" fill="#fee2e2" stroke="#dc2626" stroke-width="1" rx="4"/>
        <text x="200" y="30" text-anchor="middle" fill="#dc2626" font-family="monospace" font-size="12">
          Mermaid Syntax Error
        </text>
        <text x="200" y="50" text-anchor="middle" fill="#7f1d1d" font-family="monospace" font-size="10">
          Please check your diagram syntax
        </text>
        <text x="200" y="70" text-anchor="middle" fill="#7f1d1d" font-family="monospace" font-size="8">
          ${error instanceof Error ? error.message.substring(0, 50) + '...' : 'Unknown error'}
        </text>
      </svg>
    `;
    
    return {
      id: 'error-' + Math.random().toString(36).substring(2, 15),
      svg: errorSvg
    };
  }
}
