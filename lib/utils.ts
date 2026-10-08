import { createCn } from "cn/config";

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "night-cta",
            "display",
            "headline",
            "page-title",
            "section-title",
            "editor-title",
            "entry-title",
            "subhead",
            "lead",
            "cta",
            "control",
          ],
        },
      ],
    },
  },
});
