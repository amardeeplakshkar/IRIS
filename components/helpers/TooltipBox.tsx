import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import React from 'react'

const TooltipBox = ({children, content}: {children: React.ReactNode, content: string}) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <span>
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
            <p>{content}</p>
        </TooltipContent>
    </Tooltip>
  )
}

export default TooltipBox