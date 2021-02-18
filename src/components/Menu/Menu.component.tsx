import React, { useEffect, useState } from 'react';
import './Menu.css';
import PageHeader from './MenuComponents/PageHeaderComponent';
import { Page } from './IMenu';
import { PageNote } from './../../services/page.services';
import { GLOBAL_APP_STATUS } from '../../global';
import { PNEvent } from '../../services/presth-notas-event/event';

function Menu() {
    const [intializing, setIntializing] = useState(false);
    const [pageList, setPageList] = useState<Page[]>([{
        pageId: '0',
        pageType: 'untitled',
        pageName: 'Untitled Note',
        active: true,
        isEditing: false,
        isSaved: false
    }]);
    const [currentPage, setCurrentPage] = useState<Page|any>({
        pageId: '0',
        pageType: 'untitled',
        pageName: 'Untitled Note',
        active: true,
        isEditing: false,
        isSaved: false
    });

    /**
     * Component's methods
     */
    const recordContent = (pageId: string, value: string, isSaved: boolean): void => {
        const pages = [ ...pageList ].map((page: Page) => {
            if (page.pageId === pageId) {
                page.pageName = value;
            }
            return page;
        });
        setPageList(pages);
        PageNote.addPage('user_123', pageId, value);
    }

    const addNewPage = (): void => {
        const pages = [ ...pageList ].map((page: Page) => {
            page.active = false;
            return page;
        });
        const newPage = {
            pageId: (pages.length + 1).toString(),
            pageType: 'untitled',
            pageName: 'Untitled Note',
            active: true,
            isEditing: true,
            isSaved: false
        }; 
        pages.push(newPage);
        setPageList(pages);
        setCurrentPage(newPage);
        PNEvent.emit('createNewNote', '');
    }

    const removePage = (pageId: string, active: boolean): void => {
        const pages = [ ...pageList ].filter((page: Page) => page.pageId !== pageId);       
        PNEvent.emit('createNewNote', '');
        // Creates a new page
        if (pages.length < 1) {
            pages.push({
                pageId: '0',
                pageType: 'untitled',
                pageName: 'Untitled Note',
                active: true,
                isEditing: false,
                isSaved: false
            });
        }

        pages[pages.length - 1].active = active ? true : pages[pages.length - 1].active;
        setPageList(pages);
        setCurrentPage(pages[pages.length - 1]);
        PNEvent.emit('renderPageData', pages[pages.length - 1].pageId);
        PageNote.removePage('user_123', pageId);
        PageNote.setActivePage('user_123', pages[pages.length - 1].pageId);
        
    }

    const setActive = (pageId: string): void => {
        let localCurrentPage: Page | any;
        const pages = [ ...pageList ].map((page: Page) => {
            if (page.pageId === pageId) {
                localCurrentPage = page;
            }
            page.active = page.pageId === pageId;
            return page;
        });
        setPageList(pages);
        setCurrentPage(localCurrentPage);
        PNEvent.emit('renderPageData', localCurrentPage.pageId);

        if (GLOBAL_APP_STATUS.getServerStatus().isDatosServerConnected) {
            PageNote.setActivePage('user_123', pageId);
        }
    }

    const setEditing = (pageId: string, editing: boolean, isActive: boolean): void => {
        let activePage: Page | null = null;
        const pages = [ ...pageList ].map((page: Page) => {
            if (page.pageId === pageId) {
                page.isEditing = editing;
                activePage = page;
            }
            
            return page;
        });

        setPageList(pages);
        if (isActive) {
            setCurrentPage(activePage);
        }
    }

    const getAllPages = (): void => {
        PageNote.getPageList('user_123');
    }

    GLOBAL_APP_STATUS.callMeWhenLive(getAllPages);

    useEffect(() => {
        PageNote.subscribe((data: any) => {
            if (data.service === 'add_page') {
                setPageList((pageList: Page[]) => {
                    const pages = [ ...pageList ].map((page: Page) => {
                        if (page.pageId === data.result.localPageId) {
                            page.pageName = data.result.pageTitle;
                            page.pageId = data.result.pageId;
                            page.isSaved = true;

                            PNEvent.emit('setPageId', data.result.pageId);
                        }
                        return page;
                    });
                    return pages;
                });
            }

            if (data.service === 'get_pages') {
                let pages: Page[];
                if (data.result && data.result.length) {
                    pages = data.result.map((_page: any) => {
                        if (_page.isActive) {
                            setCurrentPage({
                                pageId: _page.pageId,
                                pageType: 'untitled',
                                pageName: _page.pageTitle,
                                active: _page.isActive,
                                isEditing: false,
                                isSaved: false
                            });
                            PNEvent.emit('renderPageData', _page.pageId);
                        }

                        return {
                            pageId: _page.pageId,
                            pageType: 'untitled',
                            pageName: _page.pageTitle,
                            active: _page.isActive,
                            isEditing: false,
                            isSaved: false
                        }
                    })
                } else {
                    pages = [{
                        pageId: '0',
                        pageType: 'untitled',
                        pageName: 'Untitled Note',
                        active: true,
                        isEditing: false,
                        isSaved: false
                    }];
                }
                setPageList(pages);
            }
        });
    }, [])

    return (
        <div className="row presth-notas-menu">
            <div className="col-md-11">
                <div className="row page-title-container">
                    {
                        currentPage 
                        ? (<PageHeader 
                            key={currentPage.pageId}
                            pageId={currentPage.pageId}
                            pageName={currentPage.pageName}
                            active={currentPage.active}
                            isEditing={currentPage.isEditing}
                            isSaved={currentPage.isSaved}
                            pin={false}
                            recordContent={recordContent} 
                            removePage={removePage}
                            setEditing={setEditing}
                        />)
                        : ''
                    }
                    
                    <div
                        className="dropdown show-page-dropdown"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            fill="white" 
                            className="bi bi-caret-down-fill show-page-btn" 
                            viewBox="0 0 16 16"
                            id="dropdownMenuButton" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                        >
                            <path 
                                d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" 
                            />
                        </svg>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {
                                pageList.map((page: Page) => (
                                    <span
                                        key={page.pageId}
                                        className={`dropdown-item notes-list ${page.active ? 'page-active' : ''}`}
                                        onClick={() => setActive(page.pageId)}
                                    >
                                        {page.pageName}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div
                        onClick={addNewPage}
                    >
                        {/* <button type="button" className="create-page">+</button> */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            fill="currentColor" 
                            className="bi bi-plus create-page" 
                            viewBox="0 0 16 16"
                        >
                            <path 
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" 
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="col-md-1 text-right">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill="currentColor" 
                    className="bi bi-list presth-notas-menu-btn" 
                    viewBox="0 0 16 16"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" 
                    />
                </svg>
            </div>
        </div>
    );
}

export default Menu;