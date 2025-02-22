"use client";
import { Toggle } from "@/components/ui/toggle";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type TipTapProps = {
  value: string;
};

const TipTap = ({ value }: TipTapProps) => {
  const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
        heading: {
          HTMLAttributes: {},
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[80px] rounded-md px-3 py-2 text-sm border border-input shadow-sm focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
  });

  // make editor content sync with react hook form value
  // useEffect(() => { <--  this will cause space problem in tiptap editor
  //   if (editor) {
  //     editor.commands.setContent(value);
  //   }
  // }, [value]);

  // useEffect(() => {
  //   if (editor?.isEmpty) {
  //     editor.commands.setContent(value);
  //   }
  // }, [value]);

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      {editor && (
        <div className="mb-1.5">
          <Toggle
            aria-label="Toggle heading one"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 style={{ width: 20, height: 20 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle heading two"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 style={{ width: 20, height: 20 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle heading three"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 style={{ width: 20, height: 20 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle bold"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold style={{ width: 16, height: 16 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic style={{ width: 16, height: 16 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle strike"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough style={{ width: 16, height: 16 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle orderedList"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered style={{ width: 18, height: 18 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle bulletList"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List style={{ width: 19, height: 19 }} />
          </Toggle>
          <Toggle
            aria-label="Toggle undo"
            pressed={editor.isActive("undo")}
            onPressedChange={() => editor.chain().focus().undo().run()}
          >
            <Eraser style={{ width: 17, height: 17 }} />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} className="heading" />
    </div>
  );
};

export default TipTap;
