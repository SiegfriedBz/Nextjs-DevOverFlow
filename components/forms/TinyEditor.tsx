"use client"

import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useState, useRef } from "react"

type TProps = {
  handleEditorChange: (content: string) => void
}
const TinyEditor = ({ handleEditorChange }: TProps) => {
  const [isClient, setIsClient] = useState(false)
  const editorRef = useRef<typeof Editor | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYEDITOR_APIKEY}
      onInit={(_evt, editor) => {
        // @ts-ignore
        editorRef.current = editor
      }}
      // onBlur={}
      onEditorChange={handleEditorChange}
      init={{
        height: 300,
        menubar: false,
        plugins: `anchor autolink charmap 
          codesample
          image lists media 
          searchreplace table visualblocks 
          checklist mediaembed 
          casechange export formatpainter 
          pageembed linkchecker a11ychecker 
          tinymcespellchecker permanentpen 
          powerpaste advtable advcode editimage 
          advtemplate mentions tableofcontents 
          footnotes mergetags autocorrect typography 
          inlinecss markdown`,
        toolbar: `undo redo 
          | codesample
          | blocks fontfamily fontsize 
          | bold italic forecolor 
          | align  
          | removeformat
          | bullits numlist
          `,
        content_style: `body { font-family:Inter; font-size:16px }`,
        // ai_request: (request, respondWith) =>
        //   respondWith.string(() =>
        //     Promise.reject(new Error("See docs to implement AI Assistant"))
        //   ),
      }}
    />
  )
}

export default TinyEditor
