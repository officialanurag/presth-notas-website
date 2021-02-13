import React, { useEffect, useRef, useState } from 'react';
import './Notepad.css';
import { Content } from './../../services/content.services';
import { GLOBAL_APP_STATUS } from './../../global';
import { PNIndexedDB } from './../../services/presth-notas-indexdb/indexdb'; 

function Notepad() {
    /**
     * Local states and instances
     */
    const pnIndexedDB = PNIndexedDB.getInstance();
    const [spellChecker, setSpellChecker] = useState(true);
    const [text, setText] = useState('');

    /**
     * Function local variables
     */
    const presthNotasEditorRef: any = useRef(null);
    let storeMode: string = 'mongodb'

    /**
     * Component's methods
     */
    const recordContent = (e: any): void => {
        if (storeMode === 'mongodb') {
            Content.storeContent('user_123', e.target.innerHTML);
        }

        if (storeMode === 'indexeddb') {
            pnIndexedDB.writeContent(e.target.innerHTML);
        }
    }

    const focusOnEditor = (): void => {
        if (presthNotasEditorRef.current) {
            presthNotasEditorRef.current.focus()
        }
    }

    const setIndexedDBStorage = (): void => {
        storeMode = 'indexeddb';
    }

    const updateDataFromIndexedDB = (content: string): void => {
        if (!content.includes('~EMPTY~')) {
            Content.storeContent('user_123', content);
        }
    }

    const setMongoDBStorage = (): void => {
        if (storeMode === 'indexeddb') {
            /**
             * Here it's first fetches the data from 
             * indexedDB and then sends it to backend
             * after network is connected
             */
            pnIndexedDB.fetchContent(updateDataFromIndexedDB);
            pnIndexedDB.writeContent('~EMPTY~');
        }
        storeMode = 'mongodb';
    }

    /**
     * Global application network status registers
     */
    GLOBAL_APP_STATUS.callMeWhenNotLive(setIndexedDBStorage);
    GLOBAL_APP_STATUS.callMeWhenLive(setMongoDBStorage);

    useEffect(() => {
        setSpellChecker(true);
        const onResponse = (data: any) => {
            if (data.service === 'fetch_content') {
                if (data.result.text !== '<br>') {
                    setText(data.result.text)
                } else {
                    setText('Start writing ...')
                }
            }
        }

        /**
         * Loads content
         */
        if (GLOBAL_APP_STATUS.getServerStatus().isDatosServerConnected && storeMode !== 'indexeddb') {
            Content.fetchContent('user_123');
        }

        Content.subscribe(onResponse);
    }, [storeMode])

    return (
        <div 
            className="presth-notas-contenteditable-parent"
            onClick={focusOnEditor}
        >
            <div
                className="presth-notas-contenteditable"
                id="presth-notas-editor"
                contentEditable={true}
                spellCheck={spellChecker}
                onKeyUp={recordContent}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{__html: text}}
                ref={presthNotasEditorRef}
            >
            </div>
        </div>
    );
}

export default Notepad;