

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export const getFileTypeLabel = (type: string): string => {
  const parts = type.split("/");
  let label = parts[parts.length - 1].toUpperCase();
  if (label.length > 7 && label.includes("-")) {
    // e.g. VND.OPENXMLFORMATS-OFFICEDOCUMENT...
    label = label.substring(0, label.indexOf("-"));
  }
  if (label.length > 10) {
    label = label.substring(0, 10) + "...";
  }
  return label;
};

// Helper function to check if a file is textual
export const isTextualFile = (file: File): boolean => {
  const textualTypes = [
    "text/",
    "application/json",
    "application/xml",
    "application/javascript",
    "application/typescript",
    "application/pdf",
  ];

 const textualExtensions = [
    "txt",
    "md",
    "py",
    "js",
    "ts",
    "jsx",
    "tsx",
    "html",
    "htm",
    "css",
    "scss",
    "sass",
    "json",
    "xml",
    "yaml",
    "yml",
    "csv",
    "sql",
    "sh",
    "bash",
    "php",
    "rb",
    "go",
    "java",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "rs",
    "swift",
    "kt",
    "scala",
    "r",
    "vue",
    "svelte",
    "astro",
    "config",
    "conf",
    "ini",
    "toml",
    "log",
    "gitignore",
    "dockerfile",
    "makefile",
    "readme",
    "pdf",
  ];

  // Check MIME type
  const isTextualMimeType = textualTypes.some((type) =>
    file.type.toLowerCase().startsWith(type)
  );

  // Check file extension
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const isTextualExtension =
    textualExtensions.includes(extension) ||
    file.name.toLowerCase().includes("readme") ||
    file.name.toLowerCase().includes("dockerfile") ||
    file.name.toLowerCase().includes("makefile");

  return isTextualMimeType || isTextualExtension;
};

// Helper function to read file content as text
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Helper function to get file extension for badge
export const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
  return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};

export const dummyData = {"content":"Amardeep Lakshkar is a Full Stack MERN Developer specializing in React, Next.js, and MongoDB. He focuses on building high-performance, scalable web applications using the MERN stack (MongoDB, Express, React, Node.js) and tools like Prisma for database management and TailwindCSS for responsive UI design[1][3]. He is based in Indore, India[3], and shares coding tips and tutorials on his Instagram profile dedicated to web development[2].","citations":["https://github.com/amardeeplakshkar","https://www.instagram.com/amardeep.webdev/","https://amardeep-portfolio.vercel.app"],"model":"sonar","usage":{"prompt_tokens":12,"completion_tokens":98,"total_tokens":110,"search_context_size":"low","cost":{"input_tokens_cost":0.000012,"output_tokens_cost":0.000098,"request_cost":0.005,"total_cost":0.00511}},"search_results":[{"title":"Amardeep Lakshkar amardeeplakshkar - GitHub","url":"https://github.com/amardeeplakshkar","date":"2024-05-05","last_updated":"2025-05-08"},{"title":"AMARDEEP LAKSHKAR〽 (@amardeep.webdev) • Instagram ...","url":"https://www.instagram.com/amardeep.webdev/","date":null,"last_updated":null},{"title":"Amardeep Lakshkar | Portfolio","url":"https://amardeep-portfolio.vercel.app","date":"2021-06-14","last_updated":"2025-05-08"}]}