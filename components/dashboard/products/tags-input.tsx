"use client";

import { Input } from "@/components/ui/input";
import { variantSchema } from "@/utils/schema-types/variant-schema-type";
import { X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

type TagsInputProps = {
  values: string[];
  handleOnChange: (tags: string[]) => void;
};

const TagsInput = ({ values = [], handleOnChange }: TagsInputProps) => {
  const [tag, setTag] = useState("");
  const { setError } = useFormContext<z.infer<typeof variantSchema>>();

  const addNewTag = () => {
    if (!tag.trim()) return;
    if (tag && tag.length < 3) {
      setError("tags", {
        type: "validate",
        message: "Please enter at least 3 characters",
      });
      return;
    } else {
      const newTag = new Set([...values, tag.trim()]);
      handleOnChange(Array.from(newTag));
      setTag("");
    }
  };

  return (
    <div>
      <Input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addNewTag();
          }
        }}
        placeholder="Press enter to save"
      />
      <div className="flex gap-1 flex-wrap ml-1 mt-2">
        {values.map((val, idx) => (
          <div
            className="text-sm border ps-3 pe-1 border-primary rounded-md flex items-center gap-2"
            key={idx}
          >
            <span> {val}</span>
            <X
              className="size-3 cursor-pointer"
              onClick={() => handleOnChange(values.filter((_, i) => i !== idx))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
