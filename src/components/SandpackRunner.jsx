import { useState, useEffect, useRef } from 'react';
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
} from '@codesandbox/sandpack-react';

// Composant interne pour interagir avec l'état de Sandpack
const SandpackListener = ({ validationConfig, onValidationResult, startingCode }) => {
    const { sandpack } = useSandpack();
    const { files } = sandpack;

    const lastResultRef = useRef(false);

    useEffect(() => {
        if (!validationConfig) return;

        const initialHtml = startingCode['/index.html'] || '';
        const normalize = (val) => val.toLowerCase().replace(/\s+/g, '');
        const normalizedInitial = normalize(initialHtml);

        const validate = () => {
            const iframe = document.querySelector('.sp-preview-iframe');
            if (!iframe || !iframe.contentWindow) return;

            const htmlFile = files['/index.html']?.code || '';
            const normalizedCurrent = normalize(htmlFile);

            // 1. Protection contre la validation immédiate (si code non modifié)
            if (normalizedCurrent === normalizedInitial) {
                if (lastResultRef.current !== false) {
                    lastResultRef.current = false;
                    onValidationResult(false);
                }
                return;
            }

            let isValid = false;

            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;

                if (validationConfig.type === 'dom' && doc) {
                    const el = doc.querySelector(validationConfig.selector);
                    if (validationConfig.property === 'innerText') {
                        if (el) {
                            isValid = normalize(el.innerText) === normalize(validationConfig.expectedValue);
                        }
                    } else if (validationConfig.property === 'outerHTML' && validationConfig.condition === 'isProperlyClosed') {
                        const tag = validationConfig.selector.match(/^[a-z0-9]+/i)?.[0] || 'p';
                        isValid = normalizedCurrent.includes(`</${tag}>`);
                    } else if (validationConfig.property === 'childrenLength') {
                        isValid = el && el.children.length === validationConfig.expectedValue;
                    } else if (el) {
                        const actualAttr = el.getAttribute(validationConfig.property) || '';
                        const expectedAttr = validationConfig.expectedValue;
                        if (validationConfig.property === 'href' || validationConfig.property === 'src') {
                            const normUrl = (u) => u.toLowerCase().replace(/\/$/, '').trim();
                            isValid = normUrl(actualAttr) === normUrl(expectedAttr);
                        } else {
                            isValid = normalize(actualAttr) === normalize(expectedAttr);
                        }
                    }
                } else if (validationConfig.type === 'css' && doc) {
                    const el = doc.querySelector(validationConfig.selector);
                    if (el && iframe.contentWindow) {
                        const computedStyle = iframe.contentWindow.getComputedStyle(el);
                        const actualValue = computedStyle.getPropertyValue(validationConfig.property);
                        isValid = normalize(actualValue) === normalize(validationConfig.expectedValue);
                    }
                } else if (validationConfig.type === 'js' && iframe.contentWindow) {
                    // Validation par variable globale ou side-effect DOM
                    if (validationConfig.property === 'globalVar') {
                        const actualValue = iframe.contentWindow[validationConfig.variableName];
                        if (typeof actualValue === 'string') {
                            isValid = normalize(actualValue) === normalize(validationConfig.expectedValue);
                        } else {
                            isValid = actualValue == validationConfig.expectedValue;
                        }
                    } else if (validationConfig.property === 'functionExists') {
                        isValid = typeof iframe.contentWindow[validationConfig.functionName] === 'function';
                    }
                }
            } catch (domError) {
                // FALLBACK : Si le DOM est inaccessible (CORS)
                const normalizedCurrent = normalize(htmlFile);
                if (validationConfig.type === 'css') {
                    const searchStr = normalize(`${validationConfig.property}:${validationConfig.expectedValue}`);
                    const simpleValue = normalize(validationConfig.expectedValue);
                    isValid = normalizedCurrent.includes(searchStr) || normalizedCurrent.includes(simpleValue);
                } else if (validationConfig.type === 'js') {
                    // Fallback JS : Recherche simple dans le code
                    const searchStr = normalize(validationConfig.expectedValue);
                    isValid = normalizedCurrent.includes(searchStr);
                } else if (validationConfig.property === 'innerText') {
                    isValid = normalizedCurrent.includes(normalize(validationConfig.expectedValue));
                } else if (validationConfig.property === 'outerHTML' && validationConfig.condition === 'isProperlyClosed') {
                    const tag = validationConfig.selector.match(/^[a-z0-9]+/i)?.[0] || 'p';
                    isValid = normalizedCurrent.includes(`</${tag}>`);
                } else if (validationConfig.property === 'childrenLength') {
                    const childTag = validationConfig.selector === 'ul' || validationConfig.selector === 'ol' ? 'li' : 'div';
                    const matches = htmlFile.toLowerCase().match(new RegExp(`<${childTag}`, 'g'));
                    isValid = matches && matches.length === validationConfig.expectedValue;
                } else if (['href', 'alt', 'src', 'placeholder', 'type'].includes(validationConfig.property)) {
                    // Pour les URLs, on cherche sans le slash final si possible
                    const value = validationConfig.expectedValue;
                    const cleanValue = (validationConfig.property === 'href' || validationConfig.property === 'src')
                        ? value.replace(/\/$/, '')
                        : value;
                    isValid = normalizedCurrent.includes(normalize(cleanValue));
                }
            }

            if (isValid !== lastResultRef.current) {
                lastResultRef.current = isValid;
                onValidationResult(isValid);
            }
        };

        const interval = setInterval(validate, 800);
        return () => clearInterval(interval);
    }, [validationConfig, onValidationResult, files, startingCode]);

    return null;
};

export default function SandpackRunner({ startingCode, validationConfig, onSuccess }) {
    const [isValid, setIsValid] = useState(false);

    // RAZ quand on change d'exercice
    useEffect(() => {
        setIsValid(false);
    }, [startingCode]);

    const handleValidationResult = (result) => {
        if (result && !isValid) {
            setIsValid(true);
            if (onSuccess) onSuccess();
        } else if (!result && isValid) {
            setIsValid(false); // Permettre de perdre la validation si on casse le code
        }
    };

    return (
        <div className="sandpack-container">
            <SandpackProvider
                template="static"
                theme="dark"
                files={startingCode}
                options={{
                    activeFile: '/index.html',
                    classes: {
                        "sp-wrapper": "custom-wrapper",
                        "sp-layout": "custom-layout",
                    }
                }}
            >
                <SandpackLayout>
                    <SandpackCodeEditor showTabs={false} showLineNumbers={true} />
                    <SandpackPreview showRefreshButton={false} showOpenInCodeSandbox={false} />
                </SandpackLayout>
                <SandpackListener
                    validationConfig={validationConfig}
                    onValidationResult={handleValidationResult}
                    startingCode={startingCode}
                />
            </SandpackProvider>

            <div className="validation-status">
                {isValid ? (
                    <div className="success-banner success-wow">
                        <svg className="success-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M6.5 10.5L8.5 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{validationConfig?.successMessage || 'Exercice validé'}</span>
                    </div>
                ) : (
                    <div className="pending-banner">
                        <span>En attente de validation</span>
                    </div>
                )}
            </div>
        </div>
    );
}
