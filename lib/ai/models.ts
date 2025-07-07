export const models = [
    {
      "name": "deepseek",
      "description": "DeepSeek V3",
      "aliases": "deepseek-v3",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": false,
      "vision": false,
      "audio": false
    },
    {
      "name": "deepseek-reasoning",
      "description": "DeepSeek R1 0528",
      "reasoning": true,
      "aliases": "deepseek-r1-0528",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": false,
      "vision": false,
      "audio": false
    },
    {
      "name": "grok",
      "description": "xAI Grok-3 Mini",
      "aliases": "grok-3-mini",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": false
    },
    {
      "name": "llamascout",
      "description": "Llama 4 Scout 17B",
      "aliases": "llama-4-scout-17b-16e-instruct",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": false,
      "vision": false,
      "audio": false
    },
    {
      "name": "mistral",
      "description": "Mistral Small 3.1 24B",
      "aliases": "mistral-small-3.1-24b-instruct",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "openai",
      "description": "OpenAI GPT-4o Mini",
      "aliases": "gpt-4o-mini",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "openai-audio",
      "description": "OpenAI GPT-4o Mini Audio Preview",
      "maxInputChars": 1000,
      "voices": [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
        "coral",
        "verse",
        "ballad",
        "ash",
        "sage",
        "amuch",
        "dan"
      ],
      "aliases": "gpt-4o-mini-audio-preview",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "audio",
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": true
    },
    {
      "name": "openai-fast",
      "description": "OpenAI GPT-4.1 Nano",
      "aliases": "gpt-4.1-nano",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "openai-large",
      "description": "OpenAI GPT-4.1",
      "aliases": "gpt-4.1",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "openai-reasoning",
      "description": "OpenAI O3 (provided by chatwithmono.xyz)",
      "reasoning": true,
      "aliases": "o3",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "vision": true,
      "audio": false
    },
    {
      "name": "openai-roblox",
      "description": "OpenAI GPT-4.1 Mini (Roblox)",
      "aliases": "gpt-4.1-mini-roblox",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "phi",
      "description": "Phi-4 Mini Instruct",
      "aliases": "phi-4-mini-instruct",
      "input_modalities": [
        "text",
        "image",
        "audio"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": false,
      "vision": true,
      "audio": true
    },
    {
      "name": "qwen-coder",
      "description": "Qwen 2.5 Coder 32B",
      "aliases": "qwen2.5-coder-32b-instruct",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": false
    },
    {
      "name": "searchgpt",
      "description": "OpenAI GPT-4o Mini Search Preview (provided by chatwithmono.xyz)",
      "search": true,
      "aliases": "gpt-4o-mini-search",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": false
    },
    {
      "name": "bidara",
      "description": "BIDARA (Biomimetic Designer and Research Assistant by NASA)",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "elixposearch",
      "description": "Elixpo Search",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": false,
      "vision": false,
      "audio": false
    },
    {
      "name": "evil",
      "description": "Evil",
      "community": true,
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "hypnosis-tracy",
      "description": "Hypnosis Tracy",
      "input_modalities": [
        "text",
        "audio"
      ],
      "output_modalities": [
        "audio",
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": true
    },
    {
      "name": "midijourney",
      "description": "MIDIjourney",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": false
    },
    {
      "name": "mirexa",
      "description": "Mirexa AI Companion",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "rtist",
      "description": "Rtist",
      "input_modalities": [
        "text"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": false,
      "audio": false
    },
    {
      "name": "sur",
      "description": "Sur AI Assistant",
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    },
    {
      "name": "unity",
      "description": "Unity Unrestricted Agent",
      "community": true,
      "input_modalities": [
        "text",
        "image"
      ],
      "output_modalities": [
        "text"
      ],
      "tools": true,
      "vision": true,
      "audio": false
    }
  ]