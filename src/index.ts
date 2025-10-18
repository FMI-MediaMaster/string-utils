type SimilarityMethod = 'jaccard' | 'lcs' | 'levenshtein';

const normalize = (str?: string | null): string =>
    str?.toString().replace(/[\W_]+/g, '').trim().toLowerCase() || '';

const jaccardSimilarity = (a: string, b: string): number => {
    const trigrams = (str: string): Set<string> => {
        const s = `  ${str}  `;
        const grams = new Set<string>();
        for (let i = 0; i < s.length - 2; i++) grams.add(s.slice(i, i + 3));
        return grams;
    };

    const setA = trigrams(a);
    const setB = trigrams(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return Math.round((intersection.size / union.size) * 100);
};

const longestCommonSubstringRatio = (a: string, b: string): number => {
    if (a.length > b.length) [a, b] = [b, a];

    let prev = Array(b.length + 1).fill(0);
    let maxLen = 0;
    for (let i = 1; i <= a.length; i++) {
        const curr = Array(b.length + 1).fill(0);
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                curr[j] = prev[j - 1] + 1;
                maxLen = Math.max(maxLen, curr[j]);
            }
        }
        prev = curr;
    }

    const maxLength = Math.max(a.length, b.length);
    return Math.round((maxLen / maxLength) * 100);
};

const levenshteinSimilarity = (a: string, b: string): number => {
    const m = a.length;
    const n = b.length;

    if (m < n) return levenshteinSimilarity(b, a);

    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);

    for (let j = 0; j <= n; j++) prev[j] = j;

    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(
                prev[j] + 1,
                curr[j - 1] + 1,
                prev[j - 1] + cost
            );
        }
        [prev, curr] = [curr, prev];
    }

    const distance = prev[n];
    return Math.round((1 - distance / Math.max(m, n)) * 100);
};

interface BestMatchOptions<T> {
  field?: keyof T;
  method?: SimilarityMethod;
  threshold?: number;
}

export default function bestMatch<T = string>(
    target: string,
    options: T[],
    { field, method = 'jaccard', threshold = 50 }: BestMatchOptions<T> = {}
): T | null {
    target = normalize(target);
    const methods = {
        'jaccard': jaccardSimilarity,
        'lcs': longestCommonSubstringRatio,
        'levenshtein': levenshteinSimilarity
    };

    let bestMatch: T | null = null;
    let bestScore = 0;
    for (const option of options) {
        const name = normalize(
            field && option && typeof option === 'object'
                ? (option[field] as unknown as string)
                : (option as unknown as string)
        );

        if (!name) continue;
        if (name === target || (target.includes(name) && name.includes(target))) {
            return option;
        }

        const score: number = methods[method](target, name);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = option;
        }
    }

    return bestScore >= threshold ? bestMatch : null;
}
