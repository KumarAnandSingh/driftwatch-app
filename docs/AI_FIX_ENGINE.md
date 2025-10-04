# AI Fix Engine Documentation

## Overview

The AI Fix Engine is an intelligent, multi-stage system that automatically generates production-ready code fixes for accessibility, design, and performance issues. It uses Claude 3.5 Sonnet to analyze issues and create WCAG 2.1 AA compliant solutions.

## Architecture

### Multi-Stage Processing Pipeline

The engine employs a sophisticated 4-stage algorithm:

#### Stage 1: Issue Classification & Prioritization
- Automatically sorts issues by severity (high → medium → low)
- Prioritizes accessibility issues first
- Selects top issues for processing (max 10 per request)

#### Stage 2: Context Analysis & Pattern Recognition
- AI analyzes root causes of each issue
- Identifies common patterns leading to the problem
- Determines best practice solution approach
- Generates context for enhanced fix generation

#### Stage 3: Enhanced Fix Generation
- Uses advanced prompt engineering with strict requirements:
  - **Correctness**: Fix must completely resolve the issue
  - **Accessibility**: Follows WCAG 2.1 AA guidelines strictly
  - **Semantic HTML**: Uses proper HTML5 semantic elements
  - **Best Practices**: Modern web development standards
  - **Performance**: Optimized and efficient code
  - **Maintainability**: Clean, well-structured code

- Temperature: 0.3 (lower for consistent, accurate fixes)
- Max tokens: 2000 per fix
- Returns structured JSON with:
  - `originalCode`: Problematic code snippet
  - `fixedCode`: Corrected code with all fixes applied
  - `explanation`: 2-3 sentence technical explanation
  - `impact`: Measurable impact description

#### Stage 4: Quality Validation
- Validates fix quality before acceptance
- Checks:
  - Code is not empty (min 10 characters)
  - Code was actually changed (not identical to original)
  - Accessibility fixes include proper ARIA/alt/role attributes
- Falls back to helpful guidance if validation fails

## Implementation Files

### Core Engine
**File**: `src/lib/ai-fix-engine.ts`

```typescript
export class AIFixEngine {
  private anthropic: Anthropic;
  private model = 'claude-3-5-sonnet-20241022';

  async generateFixes(
    issues: Issue[],
    url: string,
    maxIssues: number = 10
  ): Promise<GeneratedFix[]>
}
```

### API Endpoint
**File**: `src/app/api/fixes/generate/route.ts`

- **Route**: `POST /api/fixes/generate`
- **Auth**: Requires authenticated session
- **API Key**: User must provide their own Anthropic API key
- **Request Body**:
  ```json
  {
    "issues": [
      {
        "id": "string",
        "title": "string",
        "category": "string",
        "severity": "high" | "medium" | "low",
        "description": "string",
        "html": "string (optional)",
        "helpUrl": "string (optional)"
      }
    ],
    "url": "string"
  }
  ```
- **Response**:
  ```json
  {
    "fixes": [
      {
        "id": "string",
        "title": "string",
        "category": "string",
        "severity": "high" | "medium" | "low",
        "description": "string",
        "originalCode": "string",
        "fixedCode": "string",
        "explanation": "string",
        "impact": "string"
      }
    ]
  }
  ```

### UI Component
**File**: `src/components/premium/FixItForMeDialog.tsx`

- Shows API key setup instructions for users without keys
- Displays fix generation progress
- Shows before/after code comparison
- Provides one-click copy functionality
- Filter fixes by severity (all/high/medium/low)

### Parent Integration
**File**: `src/app/(app)/projects/[projectId]/runs/[runId]/results/page.tsx`

- Checks if user has API key on page load
- Passes `hasApiKey` prop to FixItForMeDialog
- Aggregates issues from accessibility and AI critique results

## Access Control

### API Key Requirement (No Premium Subscription)
- ✅ **Free for all users** with their own Anthropic API key
- ❌ No system API key fallback
- 🔐 User keys are AES-256 encrypted in database

### Setup Instructions Shown in UI:
1. Get free API key from Anthropic Console
2. Go to Settings → API Keys
3. Paste key and save (encrypted securely)
4. Start generating AI fixes for free!

## Error Handling

### API Key Errors
- **Missing API key**: Shows setup instructions in dialog
- **Invalid API key**: Returns 401 with helpful message
- **Error response format**:
  ```json
  {
    "error": "API key required",
    "message": "Please add your Anthropic API key...",
    "requiresApiKey": true
  }
  ```

### Rate Limiting
- **Detection**: Catches "rate limit" in error messages
- **Response**: 429 status with retry guidance
- **Prevention**: 500ms delay between fix generations

### Generation Failures
- **Fallback fixes**: Provides documentation reference
- **Partial results**: Returns successful fixes even if some fail
- **Error logging**: Comprehensive console logging for debugging

## Performance Optimizations

### Rate Limiting Strategy
- 500ms delay between consecutive API calls
- Prevents Anthropic API throttling
- Ensures smooth user experience

### Request Optimization
- Max 10 issues per request
- Prioritization ensures most critical fixes generated first
- Progressive UI updates during generation

### Token Efficiency
- Context analysis: 300 tokens max
- Fix generation: 2000 tokens max
- Total ~2300 tokens per issue

## Usage Example

```typescript
// Initialize engine with user's API key
const fixEngine = new AIFixEngine(userApiKey);

// Generate fixes for issues
const fixes = await fixEngine.generateFixes(
  issues,      // Array of issues
  pageUrl,     // Page URL for context
  10           // Max issues to process
);

// Use generated fixes
fixes.forEach(fix => {
  console.log(`Fix for: ${fix.title}`);
  console.log(`Original: ${fix.originalCode}`);
  console.log(`Fixed: ${fix.fixedCode}`);
  console.log(`Explanation: ${fix.explanation}`);
  console.log(`Impact: ${fix.impact}`);
});
```

## Testing Recommendations

### Unit Tests
- Test issue prioritization logic
- Validate JSON parsing from AI responses
- Test fallback handling

### Integration Tests
- Test with various issue types
- Verify API key requirement enforcement
- Test error handling scenarios

### E2E Tests
- Test full user flow from results page
- Verify API key setup instructions
- Test fix generation and copy functionality

## Monitoring & Logging

### Console Logging Format
```
🚀 Initializing AI Fix Engine for N issues...
📊 Prioritized top N critical issues
🔍 [1/N] Analyzing: [Issue Title]
✅ [1/N] Fix generated and validated
⚠️ [1/N] Fix validation failed, using fallback
❌ [1/N] Error generating fix: [Error]
✨ AI Fix Engine: Generated N fixes successfully
```

### Metrics to Track
- Fix generation success rate
- API call duration
- User API key setup rate
- Fix acceptance rate (user copies code)

## Security Considerations

### API Key Storage
- AES-256 encryption at rest
- Never exposed in client-side code
- Retrieved server-side only for authenticated users

### Input Validation
- Issue array validation
- URL sanitization
- Max issues limit enforcement

### Output Sanitization
- JSON parsing with error handling
- XSS prevention in rendered code
- Safe clipboard operations

## Future Enhancements

### Planned Features
1. **Batch Processing**: Process multiple pages simultaneously
2. **Fix Preview**: Visual diff before/after in browser
3. **Auto-Apply**: Optional one-click apply to codebase
4. **Fix History**: Track applied fixes and rollback capability
5. **Custom Rules**: User-defined fix preferences
6. **Performance Metrics**: Track fix impact on scores

### Model Improvements
1. **Fine-tuning**: Train on DriftWatch-specific patterns
2. **Multi-model**: Support for different AI providers
3. **Specialized Models**: Different models for different issue types
4. **Cost Optimization**: Model routing based on issue complexity

## Troubleshooting

### Common Issues

**Issue**: "API key required" error
- **Solution**: User needs to add Anthropic API key in Settings

**Issue**: Rate limit errors
- **Solution**: Implemented 500ms delays; user should wait and retry

**Issue**: Invalid JSON from AI
- **Solution**: Improved prompt with strict JSON format; validation catches errors

**Issue**: Fixes not appearing in UI
- **Solution**: Check browser console; verify API key is set; check network tab

## Related Documentation

- [API Keys Setup](./API_KEYS.md)
- [Accessibility Scanner](./ACCESSIBILITY_SCANNER.md)
- [AI Critique Service](./AI_CRITIQUE.md)
- [User Settings](./USER_SETTINGS.md)

## Support

For issues or questions:
1. Check logs in browser console and terminal
2. Verify API key is properly set
3. Review error messages for specific guidance
4. Check GitHub Issues for known problems

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
