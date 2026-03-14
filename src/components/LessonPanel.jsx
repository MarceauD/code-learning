import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code2, Lightbulb } from 'lucide-react';

function LessonPanel({ lesson }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!lesson) return null;

    const formatLesson = (text) => {
        if (!text) return '';
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/^### (.+)$/gm, '<h3 class="lesson-h3">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="lesson-h2">$1</h2>')
            .replace(/^---$/gm, '<hr class="lesson-divider"/>')
            .replace(/\n\n/g, '</p><p class="lesson-p">')
            .replace(/\n/g, '<br/>');
        return { __html: `<p class="lesson-p">${html}</p>` };
    };

    const formatCodeBlock = (code) => {
        if (!code) return null;
        return (
            <div className="lesson-code-block">
                <div className="lesson-code-header">
                    <Code2 size={14} />
                    <span>Exemple de code</span>
                </div>
                <pre className="lesson-code-pre"><code>{code}</code></pre>
            </div>
        );
    };

    return (
        <div className={`lesson-panel ${isOpen ? 'lesson-panel--open' : ''}`}>
            <button
                className="lesson-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="lesson-toggle-left">
                    <BookOpen size={16} />
                    <span>Cours & Explications</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div className="lesson-content">
                    {lesson.tip && (
                        <div className="lesson-tip">
                            <Lightbulb size={14} className="lesson-tip-icon" />
                            <span>{lesson.tip}</span>
                        </div>
                    )}

                    {lesson.explanation && (
                        <div
                            className="lesson-explanation"
                            dangerouslySetInnerHTML={formatLesson(lesson.explanation)}
                        />
                    )}

                    {lesson.codeExample && formatCodeBlock(lesson.codeExample)}

                    {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                        <div className="lesson-key-points">
                            <p className="lesson-key-points-title">À retenir :</p>
                            <ul>
                                {lesson.keyPoints.map((point, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: point.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>') }}></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LessonPanel;
