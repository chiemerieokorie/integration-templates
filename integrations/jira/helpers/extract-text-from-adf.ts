import type { AtlassianDocument } from '../types.js';

/**
 * Extracts plain text from an Atlassian Document Format (ADF) node by
 * recursively collecting all text-type leaf nodes.
 *
 * Returns null when the node is null or produces no text; returns a string
 * when the comment mapper needs a non-nullable result, callers should fall
 * back to '' on null.
 */
export function extractTextFromAdf(node: AtlassianDocument | null): string | null {
    if (!node) return null;
    function walk(n: { type?: string; text?: string; content?: (typeof n)[] }): string {
        if (n.type === 'text' && typeof n.text === 'string') return n.text;
        if (Array.isArray(n.content)) return n.content.map(walk).join('');
        return '';
    }
    const text = walk(node);
    return text.length > 0 ? text : null;
}
