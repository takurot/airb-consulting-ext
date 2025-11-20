import { ListingData } from '@/types/listing';

export const generatePricingAnalysisPrompt = (listing: ListingData): string => {
    return `
あなたはAirbnb運用のプロフェッショナルです。
以下の物件データを分析し、現在の価格設定（¥${listing.price}）の妥当性を評価してください。

【物件データ】
- タイトル: ${listing.title}
- 価格: ¥${listing.price} / 泊
- 定員: ${listing.capacity}名
- 間取り: ${listing.bedrooms}ベッドルーム, ${listing.bathrooms}バスルーム
- 場所: ${listing.location.name}
- レビュー: ${listing.rating} (${listing.reviewCount}件)
- スーパーホスト: ${listing.isSuperhost ? 'はい' : 'いいえ'}

【出力フォーマット (JSON)】
{
  "judgment": "適正" | "割高" | "割安",
  "recommendedPriceMin": number,
  "recommendedPriceMax": number,
  "reason": "150文字程度の日本語での解説。なぜその判定になったのか、周辺相場や物件の魅力を考慮して説明してください。"
}
`;
};

export const generateListingOptimizationPrompt = (listing: ListingData): string => {
    return `
あなたはAirbnbのSEOとコピーライティングの専門家です。
以下の物件のクリック率(CTR)と成約率(CVR)を高めるための改善案を作成してください。

【物件データ】
- 現在のタイトル: ${listing.title}
- 現在の説明文: ${listing.description.substring(0, 300)}...
- 定員: ${listing.capacity}名
- 特徴: ${listing.amenities?.join(', ') || '特になし'}
- 場所: ${listing.location.name}

【出力フォーマット (JSON)】
{
  "titleSuggestions": [
    {
      "title": "35文字以内の魅力的なタイトル案1",
      "targetAudience": "ファミリー向け"
    },
    {
      "title": "35文字以内の魅力的なタイトル案2",
      "targetAudience": "リモートワーク向け"
    },
    {
      "title": "35文字以内の魅力的なタイトル案3",
      "targetAudience": "カップル向け"
    }
  ],
  "descriptionOpener": "ゲストの心を掴む、魅力的で情景が浮かぶような冒頭文（100〜150文字）。"
}
`;
};
