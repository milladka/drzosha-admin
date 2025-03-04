'use client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Italic,
    List,
    Paragraph,
    Underline
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ar.js';
import 'ckeditor5/ckeditor5.css';

export default function Editor({ description, onChange }) {
    return (
        <CKEditor
            editor={ClassicEditor}
            onChange={onChange}
            config={{
                height: 400,
                language: 'ar',
                translations: [translations],
                contentsLangDirection: 'rtl',
                licenseKey: 'GPL',
                plugins: [Essentials, Paragraph, Bold, Italic, BlockQuote,
                    Heading,
                    List,
                    Underline],
                toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'blockquote', 'heading', 'list'],
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'پاراگراف',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'font-bold'
                        }
                    ]
                },
                initialData: description || "",
            }}
        />
    )
}