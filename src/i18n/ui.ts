export type UiLanguage = "en" | "ja";

export const dictionaryEN = {
  topbar: {
    productName: "Paper to Startup",
    productTag: "Research opportunity studio"
  },
  language: {
    label: "UI language",
    options: {
      en: "EN",
      ja: "日本語"
    }
  },
  hero: {
    badge: "Research-to-startup pipeline",
    title: "Turn one academic PDF into a fundable startup thesis.",
    description:
      "Upload a paper and get a research summary, six startup concepts, ranked opportunities, a concept visual, and an interactive opportunity map in one pass.",
    badges: {
      ideas: "6 startup ideas",
      feasibility: "Feasibility scoring",
      map: "Visual opportunity graph"
    },
    steps: {
      analysis: {
        title: "Direct PDF analysis",
        copy: "We send the original PDF to AI."
      },
      ranking: {
        title: "Opportunity ranking",
        copy: "Each idea is scored for novelty, feasibility, monetization, and fit."
      },
      output: {
        title: "Founder-ready output",
        copy: "You get a best concept, image prompt, radar, and market map."
      }
    }
  },
  upload: {
    title: "Upload paper",
    description:
      "PDF only, up to 20MB. We analyze one paper at a time for a clean MVP flow.",
    analyzeButton: "Analyze paper",
    analyzeErrorTitle: "Analysis failed",
    limitModalTitle: "Upload limit reached",
    limitModalBody:
      "It looks like you're enjoying the app. Email me at nyriabova@gmail.com to keep going.",
    limitModalClose: "Close",
    emptyStateTitle: "What you will get",
    emptyStateCopy:
      "Summary, best startup recommendation, concept image, feasibility radar, ranked idea cards, and an opportunity map.",
    loadingTitle: "Building the opportunity thesis",
    loadingCopy:
      "Reading the paper, generating startups, ranking ideas, and drafting the concept image.",
    loadingStageLabel: "Current process",
    loadingDetailLabel: "Now working on",
    loadingStages: {
      ingestion: "Reading the PDF and identifying the strongest technical signal.",
      summary: "Summarizing the paper into a founder-friendly thesis.",
      startups: "Generating startup ideas from the core research insight.",
      ranking: "Comparing novelty, feasibility, monetization, and timing.",
      imaging: "Drafting a visual concept for the most promising company."
    },
    loadingDetails: {
      abstract: "Scanning the abstract and extracting the main claim.",
      methods: "Checking methods and constraints for what can become a product.",
      commercial: "Looking for real buyers, budgets, and adoption friction.",
      defensibility: "Stress-testing moats, risks, and differentiation.",
      packaging: "Turning the best concept into a polished founder narrative."
    }
  },
  uploader: {
    invalidTitle: "Invalid file",
    invalidPdf: "Please choose a PDF file.",
    invalidSize: "That PDF is larger than 20MB.",
    dropPrompt: "Drag in a research paper or click to browse",
    helper:
      "We send the original PDF to the model adapter directly. No local text extraction is added in this MVP.",
    pdfOnly: "PDF only, maximum 20MB.",
    sampleTitle: "Try a sample paper",
    sampleDescription: "No paper handy? Start with one of these examples.",
    selectedSize: "{{size}} MB selected",
    clear: "Clear file"
  },
  summary: {
    title: "Paper summary",
    innovationTitle: "Core innovation"
  },
  bestStartup: {
    title: "Best startup",
    topScore: "Top score {{score}}",
    whyItResonates: "Why it resonates",
    fallbackReason:
      "This concept pairs the paper's differentiated technical insight with a commercially clear buyer problem.",
    imagePromptTitle: "Image prompt direction"
  },
  image: {
    title: "Concept image",
    description:
      "A visual direction for {{startupName}}, generated after the winning idea is selected.",
    fallback: "No image was returned, so this section is using a text-only fallback."
  },
  radar: {
    title: "Startup feasibility radar",
    description: "Normalized 0-100 scoring for the winning startup concept.",
    chartName: "Feasibility",
    metrics: {
      technicalDifficulty: "Tech difficulty",
      timeToMarket: "Time to market",
      marketSize: "Market size",
      defensibility: "Defensibility",
      revenuePotential: "Revenue",
      executionRisk: "Execution risk"
    }
  },
  startups: {
    title: "Other startup ideas",
    score: "Score {{score}}",
    problem: "Problem",
    solution: "Solution",
    businessModel: "Business model",
    whyNow: "Why now",
    improvedPositioning: "Improved positioning",
    keyRisks: "Key risks"
  },
  map: {
    title: "Opportunity map",
    description:
      "The paper's research insight translated into technologies, markets, and startup concepts.",
    empty: "The opportunity graph came back empty, so there is nothing to render yet."
  }
} as const;

export const dictionaryJA = {
  topbar: {
    productName: "Paper to Startup",
    productTag: "研究機会スタジオ"
  },
  language: {
    label: "表示言語",
    options: {
      en: "EN",
      ja: "日本語"
    }
  },
  hero: {
    badge: "研究から起業アイデアへの変換",
    title: "学術PDFを、資金調達可能なスタートアップ仮説に変える。",
    description:
      "論文をアップロードすると、研究要約、6つのスタートアップ案、順位付け、コンセプト画像、機会マップを一度に生成します。",
    badges: {
      ideas: "6つの起業案",
      feasibility: "実現性スコア",
      map: "機会マップ"
    },
    steps: {
      analysis: {
        title: "PDFをそのまま解析",
        copy: "元のPDFをアダプター経由でAIへ送信します。"
      },
      ranking: {
        title: "機会をランキング",
        copy: "各アイデアを新規性、実現性、収益性、適合度で評価します。"
      },
      output: {
        title: "起業家向け出力",
        copy: "最有力案、画像プロンプト、レーダー、機会マップを取得できます。"
      }
    }
  },
  upload: {
    title: "論文をアップロード",
    description: "PDFのみ、最大20MB。MVPとして1回に1本の論文を解析します。",
    analyzeButton: "論文を解析",
    analyzeErrorTitle: "解析に失敗しました",
    limitModalTitle: "アップロード上限に達しました",
    limitModalBody:
      "このアプリを気に入っていただけたようです。続けたい場合は nyriabova@gmail.com までメールしてください。",
    limitModalClose: "閉じる",
    emptyStateTitle: "生成される内容",
    emptyStateCopy:
      "要約、最有力スタートアップ、コンセプト画像、実現性レーダー、順位付きアイデアカード、機会マップを表示します。",
    loadingTitle: "起業機会を構築中",
    loadingCopy:
      "論文を読み込み、アイデアを生成し、順位付けし、コンセプト画像を作成しています。",
    loadingStageLabel: "進行中の工程",
    loadingDetailLabel: "現在の作業",
    loadingStages: {
      ingestion: "PDFを読み取り、最も強い技術的シグナルを見つけています。",
      summary: "論文を、起業家が理解しやすい仮説に要約しています。",
      startups: "研究の中核インサイトから起業アイデアを生成しています。",
      ranking: "新規性、実現性、収益性、タイミングを比較しています。",
      imaging: "最有力案のビジュアルコンセプトを組み立てています。"
    },
    loadingDetails: {
      abstract: "アブストラクトを確認し、主張の核を抽出しています。",
      methods: "手法と制約を見て、製品化できる部分を探しています。",
      commercial: "顧客、予算、導入障壁を見極めています。",
      defensibility: "防御力、リスク、差別化の強さを確認しています。",
      packaging: "最有力案を、伝わる起業ストーリーに整えています。"
    }
  },
  uploader: {
    invalidTitle: "無効なファイルです",
    invalidPdf: "PDFファイルを選択してください。",
    invalidSize: "PDFサイズが20MBを超えています。",
    dropPrompt: "研究論文をドラッグするか、クリックして選択してください",
    helper:
      "このMVPでは元のPDFをそのままモデルへ送信し、ローカルのテキスト抽出は行いません。",
    pdfOnly: "PDFのみ、最大20MB。",
    sampleTitle: "サンプル論文を試す",
    sampleDescription: "手元に論文がなくても、このサンプルですぐに試せます。",
    selectedSize: "{{size}} MB を選択中",
    clear: "ファイルをクリア"
  },
  summary: {
    title: "論文の要約",
    innovationTitle: "中核となる技術革新"
  },
  bestStartup: {
    title: "最有力スタートアップ",
    topScore: "最高スコア {{score}}",
    whyItResonates: "有望な理由",
    fallbackReason:
      "この案は、論文の差別化された技術的洞察と、商業的に明確な顧客課題を結び付けています。",
    imagePromptTitle: "画像プロンプトの方向性"
  },
  image: {
    title: "コンセプト画像",
    description: "{{startupName}} の勝ち筋を可視化するために生成されたイメージです。",
    fallback: "画像が返らなかったため、このセクションはテキストのみで表示しています。"
  },
  radar: {
    title: "スタートアップ実現性レーダー",
    description: "最有力案を0〜100で正規化して表示します。",
    chartName: "実現性",
    metrics: {
      technicalDifficulty: "技術難易度",
      timeToMarket: "市場投入速度",
      marketSize: "市場規模",
      defensibility: "防御力",
      revenuePotential: "収益性",
      executionRisk: "実行リスク"
    }
  },
  startups: {
    title: "その他のスタートアップ案",
    score: "スコア {{score}}",
    problem: "課題",
    solution: "解決策",
    businessModel: "ビジネスモデル",
    whyNow: "今なぜ必要か",
    improvedPositioning: "改善されたポジショニング",
    keyRisks: "主なリスク"
  },
  map: {
    title: "機会マップ",
    description:
      "論文の研究インサイトが、技術、市場、スタートアップ案へどうつながるかを示します。",
    empty: "機会グラフが空のため、まだ表示できる内容がありません。"
  }
} as const;

export const uiCopy = {
  en: dictionaryEN,
  ja: dictionaryJA
} as const;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends string
    ? ""
    : T extends readonly unknown[]
      ? ""
      : T extends object
        ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
        : never;

export type TranslationKey = Leaves<typeof dictionaryJA>;
export type TranslationParams = Record<string, string | number>;
