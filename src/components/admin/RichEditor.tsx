import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link as LinkIcon,
  Image as ImageIcon, Youtube as YoutubeIcon, Undo, Redo, Minus,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { uploadPostImage } from "@/lib/postImages";
import { toast } from "@/hooks/use-toast";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const ToolbarBtn = ({
  onClick, active, disabled, children, label,
}: { onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; label: string }) => (
  <Button
    type="button"
    size="sm"
    variant={active ? "default" : "ghost"}
    className="h-8 w-8 p-0"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
  >
    {children}
  </Button>
);

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await uploadPostImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      toast({
        title: "Image upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border border-border rounded-t-lg bg-muted/40 p-1.5">
      <ToolbarBtn label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={14} /></ToolbarBtn>
      <ToolbarBtn label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={14} /></ToolbarBtn>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarBtn label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={14} /></ToolbarBtn>
      <ToolbarBtn label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={14} /></ToolbarBtn>
      <ToolbarBtn label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={14} /></ToolbarBtn>
      <ToolbarBtn label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={14} /></ToolbarBtn>
      <ToolbarBtn label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={14} /></ToolbarBtn>
      <ToolbarBtn label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}><Code size={14} /></ToolbarBtn>
      <ToolbarBtn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></ToolbarBtn>
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarBtn label="Link" onClick={addLink} active={editor.isActive("link")}><LinkIcon size={14} /></ToolbarBtn>
      <ToolbarBtn label="Insert image" onClick={() => fileRef.current?.click()}><ImageIcon size={14} /></ToolbarBtn>
      <ToolbarBtn label="Embed YouTube" onClick={addYoutube}><YoutubeIcon size={14} /></ToolbarBtn>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <div className="w-px h-6 bg-border mx-1" />
      <ToolbarBtn label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={14} /></ToolbarBtn>
      <ToolbarBtn label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={14} /></ToolbarBtn>
    </div>
  );
};

const RichEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg my-6 max-w-full h-auto" } }),
      Youtube.configure({ nocookie: true, HTMLAttributes: { class: "rounded-lg my-6 aspect-video w-full" } }),
      Placeholder.configure({ placeholder: "Start writing your story…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-neutral dark:prose-invert max-w-none min-h-[420px] px-4 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external content changes (e.g. HTML import) into the editor.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  return (
    <div className="border border-border rounded-lg bg-background">
      <Toolbar editor={editor} />
      <div className="border-t border-border rounded-b-lg">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditor;