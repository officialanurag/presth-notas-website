import React, { useEffect, useRef, useState } from 'react';
import './Notepad.css';
import { Content } from './../../services/content.services';
import { GLOBAL_APP_STATUS } from './../../global';
import { PNIndexedDB } from './../../services/presth-notas-indexdb/indexdb'; 
import { PNEvent } from '../../services/presth-notas-event/event';
import { PNLStorage } from '../../services/presth-notas-localstorage';

function Notepad() {
    const userId: string = PNLStorage.get('_ui') || '';
    /**
     * Local states and instances
     */
    const pnIndexedDB = PNIndexedDB.getInstance();
    const [spellChecker, setSpellChecker] = useState(true);
    const [text, setText] = useState('');
    const [currentPageId, setCurrentPageId] = useState('');

    /**
     * Function local variables
     */
    const presthNotasEditorRef: any = useRef(null);
    let storeMode: string = 'mongodb'

    /**
     * Component's methods
     */
    const recordContent = (e: any): void => {
        if (storeMode === 'mongodb' && currentPageId !== '' && GLOBAL_APP_STATUS.isUserLoggedIn()) {
            Content.storeContent(userId, currentPageId, e.target.innerHTML);
        }

        if (storeMode === 'indexeddb' && GLOBAL_APP_STATUS.isUserLoggedIn()) {
            pnIndexedDB.writeContent(e.target.innerHTML);
        }

        if (!GLOBAL_APP_STATUS.isUserLoggedIn()) {
            const localPage: any = JSON.parse(PNLStorage.get('_pages') || '{}');
            localPage['text'] = e.target.innerHTML;
            PNLStorage.set('_pages', JSON.stringify(localPage));
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
        if (!content.includes('~EMPTY~') && currentPageId !== '' && GLOBAL_APP_STATUS.isUserLoggedIn()) {
            Content.storeContent(userId, currentPageId, content);
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

    const loadContent = (pageId: string): void => {
        setSpellChecker(true);
        if (GLOBAL_APP_STATUS.isUserLoggedIn()) {
            if (
                GLOBAL_APP_STATUS.getServerStatus().isDatosServerConnected && 
                storeMode !== 'indexeddb'
            ) {
                Content.fetchContent(userId, pageId);
            }
        }
    }

    const listenToEvents = (eventName: string, payload: any) => {
        const eventsMethods: {[key: string]: Function} = {
            'renderPageData': () => {
                if (GLOBAL_APP_STATUS.isUserLoggedIn()) {
                    setCurrentPageId(payload);
                    loadContent(payload);
                } else {
                    const localPage: any = JSON.parse(PNLStorage.get('_pages') || '{}');
                    if (localPage && localPage.text) {
                        setText(localPage.text);
                    }
                }
            },
            'createNewNote': () => {
                setCurrentPageId('');
                setText('');
            },
            'setPageId': () => {
                setCurrentPageId(payload);
            }
        }
        eventsMethods[eventName]();
    }

    PNEvent.register('renderPageData', listenToEvents);
    PNEvent.register('createNewNote', listenToEvents);
    PNEvent.register('setPageId', listenToEvents);


    useEffect(() => {
        const onResponse = (data: any) => {
            if (data.service === 'fetch_content') {
                if (data.result.text !== '<br>') {
                    setText(data.result.text)
                } else {
                    setText('Start writing ...')
                }
            }
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