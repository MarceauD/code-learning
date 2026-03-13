import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react';
import exercises from '../data/exercises.json';

// Grouper les exercices par chapitre
const groupedExercises = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.chapterId]) {
        acc[exercise.chapterId] = {
            id: exercise.chapterId,
            title: exercise.chapterTitle,
            exercises: []
        };
    }
    acc[exercise.chapterId].exercises.push(exercise);
    return acc;
}, {});

export default function Sidebar({ currentExerciseId, onSelectExercise, completedExercises }) {
    // État pour savoir quels chapitres sont ouverts (par défaut le chapitre 1 est ouvert)
    const [openChapters, setOpenChapters] = useState({ 1: true });

    const toggleChapter = (chapterId) => {
        setOpenChapters(prev => ({
            ...prev,
            [chapterId]: !prev[chapterId]
        }));
    };

    return (
        <aside className="sidebar">
            <h2>
                <span style={{ color: '#0ea5e9' }}>Q</span>-Learning
            </h2>
            <div className="chapter-list">
                {Object.values(groupedExercises).map(chapter => (
                    <div key={chapter.id} className="chapter-section">
                        <div
                            className="chapter-header"
                            onClick={() => toggleChapter(chapter.id)}
                        >
                            <span className="chapter-title">{chapter.title}</span>
                            {openChapters[chapter.id] ? <ChevronDown size={14} color="#64748b" /> : <ChevronRight size={14} color="#64748b" />}
                        </div>

                        {openChapters[chapter.id] && (
                            <ul className="exercise-list">
                                {chapter.exercises.map(ex => {
                                    const isCompleted = completedExercises.includes(ex.id);
                                    const isActive = currentExerciseId === ex.id;

                                    return (
                                        <li
                                            key={ex.id}
                                            className={`exercise-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => onSelectExercise(ex.id)}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 size={18} className="icon-check" />
                                            ) : (
                                                <Circle size={18} className="icon-circle" />
                                            )}
                                            <span>{ex.title}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}
