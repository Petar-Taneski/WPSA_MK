# Dashboard System Guide

## Overview

The dashboard system provides a comprehensive content management interface for creating, editing, and deleting news articles and events. It includes all the features requested:

- Complete CRUD operations for News Articles and Events
- All interface fields supported (with optional field handling)
- Gallery image upload with size limits (max 5 images, 5MB each, 25MB total)
- Related links management
- Bilingual support (English/Macedonian)
- Firebase integration for data and file storage
- Comprehensive error handling and user feedback

## Components Structure

```
src/components/dashboardd/
├── Dashboard.tsx         # Main orchestrator component
├── NewsForm.tsx         # News article form with validation
├── EventForm.tsx        # Event form with validation
├── GalleryUpload.tsx    # Image upload with size management
├── LinkManager.tsx      # Related links management
├── Post.tsx            # Export alias for Dashboard
└── index.ts            # Export barrel
```

## Features

### 1. News Article Management

- **Required fields**: title, summary, content, lang
- **Optional fields**: imageUrl, altText, author, tags, links, gallery
- Tags are comma-separated and automatically parsed
- Rich text editor for content (ReactQuill)

### 2. Event Management

- **Required fields**: title, summary, content, eventDate, location, lang
- **Optional fields**: imageUrl, isFeatured, eventEndDate, formUrl, links, gallery
- Date validation (end date must be after start date)
- Featured event toggle

### 3. Gallery Management

- Maximum 5 images per post/event
- 5MB limit per image
- 25MB total size limit
- Supported formats: JPG, PNG, GIF, WebP
- Real-time size validation and warnings
- Alt text editing for accessibility
- Images stored in Firebase Storage

### 4. Link Management

- Add multiple related links
- URL validation
- Test links functionality
- Empty link filtering before save

### 5. Validation & Error Handling

- Real-time form validation
- User-friendly error messages
- Bilingual error messages
- Network error handling
- File size and type validation

## Size Limitations & Controls

### Gallery Size Limits

The system implements several layers of size control:

1. **File Count**: Maximum 5 images per post/event
2. **Individual File Size**: 5MB maximum per image
3. **Total Size**: 25MB maximum for all images combined
4. **File Type**: Only image files (JPG, PNG, GIF, WebP) allowed

### Validation Logic

```typescript
// File count validation
if (images.length + files.length > GALLERY_SIZE_LIMIT) {
  // Show error and prevent upload
}

// Individual file size validation
if (file.size > MAX_FILE_SIZE) {
  // Show error for specific file
}

// Total size validation
if (totalSize + file.size > MAX_TOTAL_SIZE) {
  // Show error and stop processing
}
```

### User Feedback

- Real-time size indicator showing current/max size
- Warning when approaching 80% of size limit
- Specific error messages for different limit violations
- Visual indicators for pending uploads

## Firebase Integration

### Collections Structure

```
news/
├── id (auto-generated)
├── title (string)
├── summary (string)
├── content (string)
├── imageUrl? (string)
├── altText? (string)
├── author? (string)
├── tags? (string[])
├── lang (string: "english" | "macedonian")
├── links? (LinkPair[])
├── gallery? (galleryPhoto[])
├── publishDate (timestamp)
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── createdBy (string: userId)
└── updatedBy (string: userId)

events/
├── id (auto-generated)
├── title (string)
├── summary (string)
├── content (string)
├── imageUrl? (string)
├── isFeatured? (boolean)
├── eventDate (timestamp)
├── eventEndDate? (timestamp)
├── location (string)
├── formUrl? (string)
├── lang (string: "english" | "macedonian")
├── links? (LinkPair[])
├── gallery? (galleryPhoto[])
├── publishDate (timestamp)
├── createdAt (timestamp)
├── updatedAt (timestamp)
├── createdBy (string: userId)
└── updatedBy (string: userId)
```

### Storage Structure

```
storage/
├── news/
│   └── {itemId}/
│       └── gallery/
│           ├── {timestamp}_0_{filename}
│           ├── {timestamp}_1_{filename}
│           └── ...
└── events/
    └── {itemId}/
        └── gallery/
            ├── {timestamp}_0_{filename}
            ├── {timestamp}_1_{filename}
            └── ...
```

## API Functions

### Enhanced CRUD Operations

- `createNewsArticle(data, uid)` - Create news with metadata
- `updateNewsArticle(id, data, uid)` - Update with user tracking
- `deleteNewsArticle(id)` - Delete with cleanup
- `createEvent(data, uid)` - Create event with metadata
- `updateEvent(id, data, uid)` - Update with user tracking
- `deleteEvent(id)` - Delete with cleanup

### Image Management

- `uploadImage(file, path)` - Upload single image
- `uploadGalleryImages(files, type, itemId)` - Upload multiple images
- `deleteImage(url)` - Clean up image from storage

### Data Fetching

- `fetchAllNewsArticles(lang?, pageSize?, lastDoc?)` - Admin news list
- `fetchAllEvents(lang?, pageSize?, lastDoc?)` - Admin events list

## Translation Support

### English Keys

All dashboard functionality is translated under the `dashboard` namespace:

- Form labels and placeholders
- Error messages and validation
- Success notifications
- Instructions and guidelines

### Macedonian Keys

Complete Macedonian translations provided for all dashboard functionality.

## Usage Examples

### Basic Usage

```typescript
import { Dashboard } from "@/components/dashboardd";

// In your admin page
<Dashboard />;
```

### Individual Components

```typescript
import { NewsForm, EventForm } from "@/components/dashboardd";

// Custom implementation
<NewsForm
  editingItem={article}
  onSuccess={() => console.log("Saved!")}
  onCancel={() => console.log("Cancelled")}
/>;
```

## Security Considerations

### Authentication Required

- Dashboard only accessible to authenticated users
- User ID tracked for all create/update operations
- Clear error message for unauthenticated access

### File Upload Security

- File type validation (images only)
- Size limits enforced
- Unique file naming to prevent conflicts
- Firebase security rules should be configured

### Data Validation

- Client-side validation for UX
- Server-side validation recommended
- URL validation for links and images
- HTML sanitization in content (handled by ReactQuill)

## Error Scenarios Handled

1. **Network Issues**: Connection timeouts, server errors
2. **File Issues**: Size limits, invalid types, upload failures
3. **Validation Errors**: Missing required fields, invalid URLs
4. **Authentication**: User not logged in, permission issues
5. **Data Conflicts**: Editing conflicts, concurrent modifications

## Future Enhancements

### Possible Improvements

1. **Drag & Drop**: File drag-and-drop interface
2. **Image Cropping**: Built-in image editing tools
3. **Bulk Operations**: Multiple item selection and operations
4. **Version History**: Track changes and allow rollbacks
5. **Media Library**: Reusable image library
6. **Rich Content**: Embedded videos, advanced formatting
7. **SEO Fields**: Meta descriptions, keywords
8. **Scheduling**: Publish date scheduling
9. **Categories**: Hierarchical organization
10. **Approval Workflow**: Multi-step content approval

### Performance Optimizations

1. **Lazy Loading**: Load components on demand
2. **Image Optimization**: Automatic compression
3. **Pagination**: Virtual scrolling for large lists
4. **Caching**: Local storage for drafts
5. **Debounced Validation**: Reduce validation calls

This dashboard system provides a solid foundation for content management while maintaining scalability and user experience.
