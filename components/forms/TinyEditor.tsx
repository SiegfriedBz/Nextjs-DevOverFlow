"use client"

import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useState, useRef } from "react"

type TProps = {
  editorValue?: string
  editorInitialValue?: string
  handleEditorChange: (content: string) => void
}

const TinyEditor = ({
  editorValue,
  editorInitialValue,
  handleEditorChange,
}: TProps) => {
  const [isClient, setIsClient] = useState(false)
  const [content, setContent] = useState(editorInitialValue || "")
  const editorRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sync editorValue with the internal content state
  useEffect(() => {
    if (editorValue !== undefined && editorValue !== content) {
      setContent(editorValue)
    }
  }, [editorValue, content])

  const handleEditorChangeInternal = (newContent: string) => {
    setContent(newContent)
    handleEditorChange(newContent)
  }

  if (!isClient) return null

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYEDITOR_APIKEY}
      onInit={(_evt, editor) => {
        editorRef.current = editor
        if (editorInitialValue) {
          editor.setContent(editorInitialValue)
        }
      }}
      value={content}
      onEditorChange={handleEditorChangeInternal}
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
      }}
    />
  )
}

export default TinyEditor
