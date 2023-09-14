"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";
import { CommentSectionLoader, PostContentLoader } from "../Skeletons";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false, loading: () => <PostContentLoader /> },
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <div className="break-words text-zinc-100">
      <Output
        data={content}
        style={style}
        className="text-sm "
        renderers={renderers}
      />
    </div>
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="overflow-x-auto rounded-md bg-slate-900 p-4">
      <code className="text-gray-100">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
