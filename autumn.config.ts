import { feature, product, priceItem, featureItem } from "atmn";

export const credits = feature({
  id: "credits",
  name: "AI Credits",
  type: "single_use",
});

export const avatarSlots = feature({
  id: "avatar_slots",
  name: "Avatar Slots",
  type: "continuous_use",
});

export const videoGeneration = feature({
  id: "video_generation",
  name: "Video Generation",
  type: "boolean",
});

export const textToSpeech = feature({
  id: "text_to_speech",
  name: "Text-to-Speech",
  type: "boolean",
});

export const socialScheduling = feature({
  id: "social_scheduling",
  name: "Social Media Scheduling",
  type: "boolean",
});

export const marketplaceAccess = feature({
  id: "marketplace_access",
  name: "Marketplace Access",
  type: "boolean",
});

export const advancedAnalytics = feature({
  id: "advanced_analytics",
  name: "Advanced Analytics",
  type: "boolean",
});

export const apiAccess = feature({
  id: "api_access",
  name: "API Access",
  type: "boolean",
});

export const prioritySupport = feature({
  id: "priority_support",
  name: "Priority Support",
  type: "boolean",
});

export const dedicatedSupport = feature({
  id: "dedicated_support",
  name: "Dedicated Support",
  type: "boolean",
});

export const customBranding = feature({
  id: "custom_branding",
  name: "Custom Branding",
  type: "boolean",
});

export const free = product({
  id: "free",
  name: "Free",
  is_default: true,
  items: [
    featureItem({
      feature_id: credits.id,
      included_usage: 100,
      interval: "month",
    }),
    featureItem({
      feature_id: avatarSlots.id,
      included_usage: 1,
    }),
    featureItem({
      feature_id: videoGeneration.id,
    }),
    featureItem({
      feature_id: textToSpeech.id,
    }),
  ],
});

export const starter = product({
  id: "starter",
  name: "Starter",
  items: [
    priceItem({
      price: 9.99,
      interval: "month",
    }),
    featureItem({
      feature_id: credits.id,
      included_usage: 500,
      interval: "month",
    }),
    featureItem({
      feature_id: avatarSlots.id,
      included_usage: 5,
    }),
    featureItem({
      feature_id: videoGeneration.id,
    }),
    featureItem({
      feature_id: textToSpeech.id,
    }),
    featureItem({
      feature_id: socialScheduling.id,
    }),
  ],
});

export const pro = product({
  id: "pro",
  name: "Pro",
  items: [
    priceItem({
      price: 29.99,
      interval: "month",
    }),
    featureItem({
      feature_id: credits.id,
      included_usage: 2000,
      interval: "month",
    }),
    featureItem({
      feature_id: avatarSlots.id,
      included_usage: 20,
    }),
    featureItem({
      feature_id: videoGeneration.id,
    }),
    featureItem({
      feature_id: textToSpeech.id,
    }),
    featureItem({
      feature_id: socialScheduling.id,
    }),
    featureItem({
      feature_id: marketplaceAccess.id,
    }),
    featureItem({
      feature_id: advancedAnalytics.id,
    }),
    featureItem({
      feature_id: prioritySupport.id,
    }),
  ],
});

export const enterprise = product({
  id: "enterprise",
  name: "Enterprise",
  items: [
    priceItem({
      price: 99.99,
      interval: "month",
    }),
    featureItem({
      feature_id: credits.id,
      included_usage: 10000,
      interval: "month",
    }),
    featureItem({
      feature_id: avatarSlots.id,
    }),
    featureItem({
      feature_id: videoGeneration.id,
    }),
    featureItem({
      feature_id: textToSpeech.id,
    }),
    featureItem({
      feature_id: socialScheduling.id,
    }),
    featureItem({
      feature_id: marketplaceAccess.id,
    }),
    featureItem({
      feature_id: advancedAnalytics.id,
    }),
    featureItem({
      feature_id: apiAccess.id,
    }),
    featureItem({
      feature_id: dedicatedSupport.id,
    }),
    featureItem({
      feature_id: customBranding.id,
    }),
  ],
});