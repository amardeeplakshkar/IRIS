"use client";

import React, { useState } from "react";
import { FileInput, FileWithPreview } from "@/components/ui/file-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Trash2,
  Download,
  Eye
} from "lucide-react";

export default function FileInputDemo() {
  const [defaultFiles, setDefaultFiles] = useState<FileWithPreview[]>([]);
  const [compactFiles, setCompactFiles] = useState<FileWithPreview[]>([]);
  const [minimalFiles, setMinimalFiles] = useState<FileWithPreview[]>([]);
  const [restrictedFiles, setRestrictedFiles] = useState<FileWithPreview[]>([]);

  const handleError = (error: string) => {
    toast.error(error);
  };

  const handleFilesChange = (files: FileWithPreview[], variant: string) => {
    console.log(`${variant} files changed:`, files);
    toast.success(`${files.length} file(s) in ${variant} variant`);
  };

  const clearFiles = (setter: React.Dispatch<React.SetStateAction<FileWithPreview[]>>) => {
    setter([]);
    toast.info("Files cleared");
  };

  const downloadFile = (file: FileWithPreview) => {
    const url = URL.createObjectURL(file.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${file.file.name}`);
  };

  const FileStats = ({ files }: { files: FileWithPreview[] }) => {
    const totalSize = files.reduce((acc, file) => acc + file.file.size, 0);
    const imageFiles = files.filter(f => f.type.startsWith('image/')).length;
    const textFiles = files.filter(f => f.type.startsWith('text/') || f.textContent).length;
    const otherFiles = files.length - imageFiles - textFiles;

    const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {files.length} files
        </Badge>
        {imageFiles > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {imageFiles} images
          </Badge>
        )}
        {textFiles > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {textFiles} text
          </Badge>
        )}
        {otherFiles > 0 && (
          <Badge variant="outline">
            {otherFiles} other
          </Badge>
        )}
        <Badge variant="secondary">
          {formatBytes(totalSize)}
        </Badge>
      </div>
    );
  };

  const FileList = ({ files }: { files: FileWithPreview[] }) => {
    if (files.length === 0) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files:</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                <span className="truncate" title={file.file.name}>
                  {file.file.name}
                </span>
                <Badge variant={file.uploadStatus === 'complete' ? 'default' : 'secondary'} className="text-xs">
                  {file.uploadStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => downloadFile(file)}
                  title="Download file"
                >
                  <Download className="h-3 w-3" />
                </Button>
                {file.preview && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => window.open(file.preview, '_blank')}
                    title="View image"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto h-dvh  container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">FileInput Component Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive file input component that supports textual and image files with drag & drop, 
          paste functionality, and customizable previews.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Default Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Default Variant
            </CardTitle>
            <CardDescription>
              Full-featured file input with large previews, file info, and text content preview.
              Supports up to 10 files, 50MB each.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileInput
              maxFiles={10}
              maxFileSize={50 * 1024 * 1024}
              onFilesChange={(files) => {
                setDefaultFiles(files);
                handleFilesChange(files, 'default');
              }}
              onError={handleError}
              enableTextPreview={true}
              showFileInfo={true}
              variant="default"
            />
            <div className="flex items-center justify-between mt-4">
              <FileStats files={defaultFiles} />
              {defaultFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearFiles(setDefaultFiles)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <FileList files={defaultFiles} />
          </CardContent>
        </Card>

        {/* Compact Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Compact Variant
            </CardTitle>
            <CardDescription>
              Space-efficient version with smaller previews and reduced padding.
              Perfect for forms and sidebars.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileInput
              maxFiles={5}
              maxFileSize={25 * 1024 * 1024}
              onFilesChange={(files) => {
                setCompactFiles(files);
                handleFilesChange(files, 'compact');
              }}
              onError={handleError}
              enableTextPreview={true}
              showFileInfo={true}
              variant="compact"
            />
            <div className="flex items-center justify-between mt-4">
              <FileStats files={compactFiles} />
              {compactFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearFiles(setCompactFiles)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <FileList files={compactFiles} />
          </CardContent>
        </Card>

        {/* Minimal Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Minimal Variant
            </CardTitle>
            <CardDescription>
              Ultra-compact version with tiny previews and minimal UI.
              Ideal for tight spaces and mobile interfaces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileInput
              maxFiles={3}
              maxFileSize={10 * 1024 * 1024}
              onFilesChange={(files) => {
                setMinimalFiles(files);
                handleFilesChange(files, 'minimal');
              }}
              onError={handleError}
              enableTextPreview={false}
              showFileInfo={false}
              variant="minimal"
            />
            <div className="flex items-center justify-between mt-4">
              <FileStats files={minimalFiles} />
              {minimalFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearFiles(setMinimalFiles)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <FileList files={minimalFiles} />
          </CardContent>
        </Card>

        {/* Restricted File Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Restricted File Types
            </CardTitle>
            <CardDescription>
              Only accepts images and text files. Demonstrates file type validation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileInput
              maxFiles={5}
              maxFileSize={20 * 1024 * 1024}
              acceptedFileTypes={['image/*', 'text/*', '.md', '.json', '.js', '.ts', '.tsx', '.jsx']}
              onFilesChange={(files) => {
                setRestrictedFiles(files);
                handleFilesChange(files, 'restricted');
              }}
              onError={handleError}
              enableTextPreview={true}
              showFileInfo={true}
              variant="default"
            />
            <div className="flex items-center justify-between mt-4">
              <FileStats files={restrictedFiles} />
              {restrictedFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearFiles(setRestrictedFiles)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
            <FileList files={restrictedFiles} />
          </CardContent>
        </Card>

        {/* Feature Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Capabilities</CardTitle>
            <CardDescription>
              Overview of all the features available in the FileInput component.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">File Support</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Images: JPG, PNG, GIF, WebP, SVG</li>
                  <li>• Text files: JS, TS, Python, HTML, CSS, MD</li>
                  <li>• Data files: JSON, CSV, XML, YAML</li>
                  <li>• Config files: ENV, INI, TOML</li>
                  <li>• Documentation: README, LICENSE</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Interaction Methods</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Click to browse and select files</li>
                  <li>• Drag and drop files from desktop</li>
                  <li>• Paste files from clipboard</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Multiple file selection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Preview Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Image thumbnails with full-size view</li>
                  <li>• Text file content preview</li>
                  <li>• File type icons and badges</li>
                  <li>• Upload progress indicators</li>
                  <li>• Error state visualization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Validation & Limits</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• File size validation</li>
                  <li>• File type restrictions</li>
                  <li>• Maximum file count limits</li>
                  <li>• Custom error handling</li>
                  <li>• Real-time feedback</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Code examples showing how to use the FileInput component in different scenarios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Usage</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`<FileInput
  maxFiles={5}
  onFilesChange={(files) => console.log(files)}
  onError={(error) => toast.error(error)}
/>`}
                </pre>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">With File Type Restrictions</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`<FileInput
  acceptedFileTypes={['image/*', 'text/*', '.pdf']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  variant="compact"
  onFilesChange={handleFiles}
/>`}
                </pre>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Minimal Configuration</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`<FileInput
  variant="minimal"
  maxFiles={3}
  showFileInfo={false}
  enableTextPreview={false}
  onFilesChange={handleFiles}
/>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}