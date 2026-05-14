
declare module 'docx-preview' {
  export function renderAsync(blob: Blob, container: HTMLElement, style?: unknown): Promise<void>;
  const _default: { renderAsync: typeof renderAsync };
  export default _default;
}

declare module 'html2pdf.js' {
  export interface Html2PdfInstance {
    set(opts: any): Html2PdfInstance;
    from(src: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
  }
  const html2pdf: () => Html2PdfInstance;
  export default html2pdf;
}

