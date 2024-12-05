# Cycle In Sidebar Plugin - Project Convention Guide

## Project Overview
The Cycle In Sidebar Plugin is an Obsidian plugin that enables users to navigate through sidebar tabs using keyboard shortcuts. It's built using TypeScript and follows Obsidian's plugin architecture.

## Core Functionality
- Provides commands to cycle through tabs in both left and right sidebars
- Supports both forward and reverse cycling
- Maintains tab state and visibility within sidebars
- Integrates with Obsidian's workspace API

## Project Structure

### Key Files
1. `main.ts`: Core plugin implementation
2. `manifest.json`: Plugin metadata and configuration
3. `package.json`: Project dependencies and scripts
4. `styles.css`: Custom styling (currently empty)

## Code Conventions

### Plugin Architecture
1. **Class Structure**
   - Main plugin class extends `Plugin` from Obsidian
   - Named `CycleInSidebarPlugin`
   - Follows Obsidian's plugin lifecycle (onload/onunload)

2. **Methods Naming**
   - Utility methods use camelCase
   - Sidebar-specific methods include direction in name (e.g., `cycleLeftSideBar`, `cycleRightSideBar`)
   - Helper methods describe their purpose (e.g., `getLeavesOfSidebar`, `isSidebarOpen`)

3. **Command Registration**
   ```typescript
   this.addCommand({
     id: 'command-id',
     name: 'Human Readable Name',
     callback: () => { /* action */ }
   });
   ```

### TypeScript Conventions

1. **Type Safety**
   - Strict null checks enabled
   - No implicit any types
   - Module resolution set to "node"
   - Targets ES6

2. **Import Structure**
   ```typescript
   import { Plugin, WorkspaceLeaf, WorkspaceSidedock } from 'obsidian';
   ```

3. **Method Signatures**
   - Clear parameter types
   - Return types specified where non-obvious
   - Async methods properly marked

### Build System

1. **ESBuild Configuration**
   - Bundles TypeScript code
   - Excludes Obsidian core modules
   - Development watch mode support
   - Production builds strip source maps

2. **NPM Scripts**
   ```json
   "dev": "node esbuild.config.mjs",
   "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
   "version": "node version-bump.mjs && git add manifest.json versions.json"
   ```

## Implementation Patterns

### Sidebar Navigation
1. **Leaf Management**
   - Retrieves all leaves in a sidebar
   - Filters out empty views
   - Maintains cycling order

2. **State Tracking**
   ```typescript
   // Pattern for checking sidebar state
   isSidebarOpen(split: WorkspaceSidedock) {
     return this.getLeavesOfSidebar(split)
       .some(l => l.view.containerEl.clientHeight > 0);
   }
   ```

3. **Cycling Logic**
   - Determines current active tab
   - Calculates next tab index
   - Handles wrap-around at list boundaries
   - Supports bidirectional navigation

### Command Registration Pattern
```typescript
{
  id: 'cycle-direction-sidebar[-reverse]',
  name: 'Cycle tabs of direction sidebar [in reverse]',
  callback: () => { this.cycleDirectionSideBar(offset) }
}
```

## Version Management

1. **Version Control**
   - Uses semantic versioning
   - Maintains minimum app version compatibility
   - Updates tracked in versions.json

2. **Version Bump Process**
   - Automated through version-bump.mjs
   - Updates both manifest.json and versions.json
   - Maintains version synchronization

## Best Practices for Extensions

1. **Plugin Integration**
   - Register commands in onload()
   - Clean up resources in onunload()
   - Use Obsidian's API for workspace manipulation

2. **Error Handling**
   - Graceful handling of missing leaves
   - Safe iteration through workspace elements
   - Boundary checking in cycling operations

3. **Performance Considerations**
   - Efficient leaf filtering
   - Minimal DOM operations
   - Clean state management

## Development Guidelines

1. **Setup**
   - Install dependencies with npm
   - Use provided build scripts
   - Test in development mode

2. **Testing**
   - Verify cycling in both directions
   - Check empty sidebar handling
   - Validate keyboard shortcut functionality

3. **Deployment**
   - Build for production
   - Update version numbers
   - Verify manifest settings

## Future Development Considerations

1. **Potential Enhancements**
   - Tab group support
   - Custom cycling order
   - State persistence
   - Animation options

2. **Compatibility**
   - Maintain Obsidian version compatibility
   - Monitor API changes
   - Update TypeScript definitions as needed
