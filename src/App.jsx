import { useState } from 'react';
import Sidebar from './components/Sidebar';
import SandpackRunner from './components/SandpackRunner';
import LessonPanel from './components/LessonPanel';
import { useProgress } from './hooks/useProgress';
import exercisesData from './data/exercises.json';

import './index.css';

function App() {
    const [currentExerciseId, setCurrentExerciseId] = useState(exercisesData[0].id);
    const { completedExercises, markExerciseCompleted, resetProgress } = useProgress();

    const currentExercise = exercisesData.find(ex => ex.id === currentExerciseId);

    const handleSuccess = () => {
        markExerciseCompleted(currentExerciseId);
    };

    const handleNextExercise = () => {
        const currentIndex = exercisesData.findIndex(ex => ex.id === currentExerciseId);
        if (currentIndex < exercisesData.length - 1) {
            setCurrentExerciseId(exercisesData[currentIndex + 1].id);
        }
    };

    const formatDescription = (text) => {
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        return { __html: html };
    };

    const currentChapterExercises = exercisesData.filter(ex => ex.chapterId === currentExercise.chapterId);
    const completedInChapter = currentChapterExercises.filter(ex => completedExercises.includes(ex.id)).length;
    const chapterProgress = (completedInChapter / currentChapterExercises.length) * 100;

    return (
        <div className="app-container">
            <Sidebar
                currentExerciseId={currentExerciseId}
                onSelectExercise={setCurrentExerciseId}
                completedExercises={completedExercises}
            />

            <main className="main-content">
                <div className="exercise-view">

                    <div className="instructions-panel">
                        <div className="chapter-progress-container">
                            <div className="progress-stats">
                                <span>Progression : {completedInChapter}/{currentChapterExercises.length}</span>
                                <span>{Math.round(chapterProgress)}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${chapterProgress}%` }}></div>
                            </div>
                        </div>

                        {currentExercise.hebrewGreeting && (
                            <div className="greeting-hebrew hebrew-text">
                                {currentExercise.hebrewGreeting}
                            </div>
                        )}
                        <h1>{currentExercise.title}</h1>

                        <div className="description" dangerouslySetInnerHTML={formatDescription(currentExercise.description)} />

                        <LessonPanel lesson={currentExercise.lesson} />

                        {completedExercises.includes(currentExerciseId) && (
                            <button className="btn-primary mt-4 hebrew-text" onClick={handleNextExercise}>
                                <span>התרגיל הבא ➔</span>
                            </button>
                        )}
                    </div>

                    <div className="editor-panel">
                        {/* Key prop force le re-render quand on change d'exercice pour nettoyer l'état de Sandpack */}
                        <SandpackRunner
                            key={currentExerciseId}
                            startingCode={currentExercise.startingCode}
                            validationConfig={currentExercise.validation}
                            onSuccess={handleSuccess}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default App;
