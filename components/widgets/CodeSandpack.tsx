import React from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { useTheme } from 'next-themes';

const CodeSandpack = ({ code, showPreview = false }: { code: string, showPreview?: boolean }) => {
    const { theme } = useTheme()
    return (
        <SandpackProvider
        options={{
        externalResources: ["https://cdn.tailwindcss.com"]
      }}
            customSetup={{
                dependencies: {
                    react: 'latest',
                    'react-dom': 'latest',
                    "lucide-react": "latest",
                    "tailwindcss": "latest",
                    "@tailwindcss/typography": "latest",
                    "uuid": "latest"
                }
            }}
            theme={theme === 'dark' ? dracula : 'light'}
            autoSave='true'
            files={{
                '/App.js': code
            }}
            template="react">
            <SandpackLayout
            style={{
                height: '92dvh'
            }}
            >
                {showPreview ? <SandpackPreview
                    style={{
                        height: '92dvh'
                    }}
                    showOpenInCodeSandbox={false}
                /> :
                    <SandpackCodeEditor 
                    style={{
                        height: '92dvh'
                    }}
                    />
                }
            </SandpackLayout>
        </SandpackProvider>
    )
}

export default CodeSandpack