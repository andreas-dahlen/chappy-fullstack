import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    "backend": {
      project: [
        "src/**/*.ts"
      ],
      entry: [
        "src/entry.ts"
      ]
    },
    "shared": {
      project: [
        "src/**/*.ts"
      ],
      entry: [
        "src/index.ts"
      ]
    },
    "frontend": {
      project: [
        "src/**/*.ts"
      ],
      entry: [
        "src/main.tsx"
      ]
    }
  }
}
export default config
