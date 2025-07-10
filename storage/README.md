# Storage Directory Documentation

## Current Status
**⚠️ This directory is currently NOT in active use by the application.**

The application currently stores all user preferences and UI state in browser's localStorage. This `storage` directory is a placeholder for future persistent storage features.

## Purpose and Design Intent

This directory is designed to serve as a persistent storage volume for dynamic, user-generated content that needs to survive container restarts and updates.

### Key Differences from Other Directories

| Directory | Purpose | Content Type | Persistence |
|-----------|---------|--------------|-------------|
| `/public/assets/` | Static scenario images | Read-only, shipped with app | Part of Docker image |
| `/src/types/defaults/` | Default scenario JSONs | Read-only, shipped with app | Part of Docker image |
| `/storage/` | User data & modifications | Read-write, user-generated | Docker volume (survives updates) |

## Planned Use Cases

### 1. User-Modified Scenarios
```
storage/
├── scenarios/
│   ├── moonlight_heist_modified.json
│   ├── custom_user_scenario.json
│   └── drafts/
│       └── work_in_progress.json
```

### 2. User-Uploaded Assets
```
storage/
├── user-assets/
│   ├── {userId}/
│   │   ├── characters/
│   │   │   └── custom_character.webp
│   │   └── backgrounds/
│   │       └── uploaded_scene.jpg
```

### 3. Export/Import Functionality
```
storage/
├── exports/
│   ├── scenario_export_2025-01-10.json
│   └── full_backup_2025-01-10.zip
├── imports/
│   └── processing/
│       └── temp_import.json
```

### 4. Versioning and Backups
```
storage/
├── versions/
│   ├── moonlight_heist/
│   │   ├── v1_2025-01-10_10-30.json
│   │   ├── v2_2025-01-10_14-45.json
│   │   └── current.json
```

### 5. User Sessions and Progress
```
storage/
├── sessions/
│   ├── user_{userId}/
│   │   ├── progress.json
│   │   ├── choices_history.json
│   │   └── achievements.json
```

## Technical Implementation

### Docker Volume Configuration

**docker-compose.yml:**
```yaml
volumes:
  - ./storage:/opt/render/project/taleseditorstoragedev
```

This creates a bind mount between:
- Host: `C:\Projects\tales-screen-editor\storage` (Windows)
- Container: `/opt/render/project/taleseditorstoragedev`

### Environment Variable
```env
REACT_APP_STORAGE_PATH=/opt/render/project/taleseditorstoragedev
```

### Why This Path?
The path `/opt/render/project/taleseditorstoragedev` is used for compatibility with Render.com deployment platform (see `render.yaml`).

## For Future Developers

### Adding Storage Functionality

1. **Create API endpoints** for file operations:
   ```typescript
   // Example: Save scenario endpoint
   app.post('/api/scenarios/:id/save', async (req, res) => {
     const { id } = req.params;
     const scenarioData = req.body;
     const filePath = path.join(STORAGE_PATH, 'scenarios', `${id}.json`);
     await fs.writeFile(filePath, JSON.stringify(scenarioData));
     res.json({ success: true });
   });
   ```

2. **Add storage service** in React:
   ```typescript
   // src/services/storageService.ts
   export const storageService = {
     saveScenario: async (id: string, data: Scenario) => {
       return fetch(`/api/scenarios/${id}/save`, {
         method: 'POST',
         body: JSON.stringify(data)
       });
     },
     loadScenario: async (id: string) => {
       return fetch(`/api/scenarios/${id}/load`);
     }
   };
   ```

3. **Handle permissions** properly:
   - Ensure proper file permissions in Docker
   - Implement user-based access control
   - Validate file uploads

### Best Practices

1. **Structure**: Keep user data organized by user ID
2. **Cleanup**: Implement regular cleanup of temporary files
3. **Limits**: Set storage quotas per user
4. **Backup**: Implement automated backup functionality
5. **Security**: Never store sensitive data unencrypted

### Testing Storage Functionality

```bash
# Test write access from container
docker exec tales-screen-editor-prod \
  sh -c "echo 'test' > /opt/render/project/taleseditorstoragedev/test.txt"

# Verify on host
cat ./storage/test.txt

# Test persistence
docker-compose restart tales-screen-editor
docker exec tales-screen-editor-prod \
  cat /opt/render/project/taleseditorstoragedev/test.txt
```

## Migration Path

When implementing storage features:

1. **Phase 1**: Add read/write API endpoints
2. **Phase 2**: Migrate localStorage data to file storage
3. **Phase 3**: Implement user authentication
4. **Phase 4**: Add quota management
5. **Phase 5**: Enable multi-device sync

## Important Notes

- ✅ Directory structure is Docker-ready
- ✅ Volume mounting is configured
- ✅ Survives container updates
- ❌ No current read/write implementation
- ❌ No API endpoints exist yet
- ❌ Frontend uses localStorage only

## Questions or Issues?

If implementing storage features, consider:
- User authentication and authorization
- File size limits and validation
- Backup and recovery procedures
- GDPR compliance for user data
- Cross-platform path compatibility

---
*Last updated: January 2025*  
*Status: Placeholder for future implementation*