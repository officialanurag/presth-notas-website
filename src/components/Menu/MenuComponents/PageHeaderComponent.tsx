import React from 'react';
import './PageHeader.css';

function PageHeader(props: {
    pageId: string,
    pageName: string,
    active: boolean,
    isEditing: boolean,
    isSaved: boolean,
    pin: boolean,
    recordContent: any, 
    removePage: any,
    setEditing: any
}) {

    const recordContent = (e: any): void => {
        props.recordContent(props.pageId, e.target.value ?? 'Untitled Note', props.isSaved);
    }

    const removePage = (): void => {
        props.removePage(props.pageId, props.active)
    }

    const activeEditing = (): void => {
        props.setEditing(props.pageId, true, props.active);
    }

    const handleEnter = (e: any): void => {
        if (e.code === 'Enter' || e.keyCode === 13) {
            props.setEditing(props.pageId, false, props.active);
        }
    }

    return (
        <>
            <div
                className={`page-title`}
                onDoubleClick={activeEditing}
                title="Doblue click to edit page name."
            >
                {
                    props.isEditing 
                    ? (<input 
                        type="text"
                        onChange={recordContent}
                        defaultValue={props.pageName}
                        className="page-title-input"
                        onKeyUp={handleEnter}
                    />)
                    : <span>
                        {
                            props.pageName.length > 80
                            ? `${props.pageName.slice(0, 80)} . . .`
                            : props.pageName
                        }
                    </span>
                }
            </div>
            <div
                className={`page-title-close`}
                onClick={removePage}
                title="Remove page."
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="white"
                    className={`bi bi-x close-page `}
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                    />
                </svg>
            </div>
        </>
    );
}

export default PageHeader;