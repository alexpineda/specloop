Based on the conversation about a web app idea and the project rules, generate a starter template that shows the complete file structure and key files needed for the project.

<project_request>
{{PROJECT_REQUEST}}
</project_request>

<project_rules>
{{PROJECT_RULES}}
</project_rules>

The template should follow this structure. Do not include any other text or comments:

1. File Map (in tree format)
   Show the complete directory structure using ASCII tree format
   Include all necessary directories and files
   Follow Next.js app router conventions
   Group related components and features

2. Key File Contents
   For each key file, provide the complete code with:
   - All necessary imports
   - Type definitions
   - Component/function implementations
   - Comments explaining complex logic
   - Proper error handling
   - Loading states where needed

Focus on:

- Clean architecture and organization
- Type safety
- Best practices for Next.js and React
- Proper error handling
- Loading states
- Data fetching patterns
- State management
- Component composition
- Reusable utilities

The output should be in this format:

<file_map>
[ASCII tree structure of all directories and files]
</file_map>

<file_contents>
File: [relative path]

```ts
[complete file contents]
```

File: [relative path]

```ts
[complete file contents]
```

[etc for each key file]
</file_contents>
