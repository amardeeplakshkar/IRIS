import React from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import { useTheme } from 'next-themes';

const CodeSandpack = ({ code, showPreview = false }: { code: string, showPreview?: boolean }) => {
    const { theme } = useTheme()

    function extractLibraryNames(code: string) {
        const regex = /import\s+(?:(?:[^{}]*?|\{[^}]*\})\s+from\s+['"])([^'"]+)['"]/g;
        const libraries = [];
        let match;
        
        while ((match = regex.exec(code)) !== null) {
          libraries.push(match[1]);
        }
        
        return libraries;
    }
    
    function createDependenciesObject(libraries: string[]) {
        const dependencies: Record<string, string> = {
            'react': 'latest',
            'react-dom': 'latest',
            'lucide-react': 'latest',
            'tailwindcss': 'latest',
            'uuid': 'latest'
        };
        
        libraries.forEach(lib => {
            dependencies[lib] = 'latest';
        });
        
        return dependencies;
    }
    
    const extractedLibraries = extractLibraryNames(code || '');
    const dependencies = createDependenciesObject(extractedLibraries);

    return (
        <SandpackProvider
        options={{
        externalResources: ["https://cdn.tailwindcss.com"]
      }}
            customSetup={{
                dependencies: dependencies
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
                {showPreview ? 
                <>
                <SandpackCodeEditor 
                className='sr-only!'
                    style={{
                        height: '92dvh',
                    }}
                    />
                <SandpackPreview
                    style={{
                        height: '92dvh'
                    }}
                    showOpenInCodeSandbox={false}
                    /> 
                    </>
                    :
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