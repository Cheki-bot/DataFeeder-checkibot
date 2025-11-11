import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionsAnswersSchema } from './schemas/questions-answers';

import {
    AddButton,
    ButtonComponent,
    InputComponent,
    ListComponent,
    SearchComponent,
} from '@/components';


import style from './QuestionsAnswers.module.css';
import { createQuestionAnswer, getQuestionsAnswers } from './service/questions-answers.service';

interface AnswersQuestions {
    question: string;
    answer: string;
}

export const QuestionsAnswers = () => {
    const [showForm, setShowForm] = useState(false);
    const [questionsAnswers, setQuestionsAnswers] = useState<
        AnswersQuestions[]
    >([]);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        resetField,
        formState: { errors },
    } = useForm<AnswersQuestions>({
        resolver: zodResolver(QuestionsAnswersSchema),
        defaultValues: {
            question: '',
            answer: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await getQuestionsAnswers();
            console.log(response);
            setQuestionsAnswers(response);
        };
        fetchData();
    }, []);

    const handleAddCandidate = async (question: AnswersQuestions) => {
        await createQuestionAnswer(question.question, question.answer);
        setQuestionsAnswers((prev) => [...prev, question]);
        reset();
    };

    const handleRemove = (questions: Array<AnswersQuestions | string>) => {
        const names = questions.map((c) =>
            typeof c === 'string' ? c : c.question
        );
        console.log(`Removing questions: ${names.join(', ')}`);
    };


    return (
        <div className={style.container}>
            {showForm && (
                <div className={style.backButton}>
                    <ButtonComponent
                        onClick={() => setShowForm(false)}
                        type="button"
                        onlyIcon
                    >
                        <div className={style.backContent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill="#ffff"
                                    fillOpacity=".8"
                                    fillRule="evenodd"
                                    d="M6.293 9.657 11.95 4l1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-5.657-5.657a1 1 0 0 1 0-1.414Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p>Volver</p>
                        </div>
                    </ButtonComponent>
                </div>
            )}
            <h2>Preguntas y respuestas</h2>

            <div className={style.content}>
                <form
                    className={style.form}
                    style={{
                        display:
                            window.innerWidth <= 768
                                ? showForm
                                    ? 'flex'
                                    : 'none'
                                : 'flex',
                    }}
                >
                    <h3>Formulario de Preguntas y Respuestas</h3>
                    <div className={style.checkboxField}>
                    </div>
                    <InputComponent
                        label="Pregunta"
                        type="text"
                        value={watch('question')}
                        validationProps={register('question')}
                        errors={errors.question}
                        onClear={() => {
                            resetField('question');
                        }}
                    />
                    <InputComponent
                        label="Respuesta"
                        type="text"
                        value={watch('answer')}
                        validationProps={register('answer')}
                        errors={errors.answer}
                        onClear={() => {
                            resetField('answer');
                        }}
                    />
                    <span className={style.buttonContainer}>
                        <ButtonComponent
                            label="Agregar Pregunta"
                            type="button"
                            onClick={handleSubmit((data) =>
                                handleAddCandidate(data)
                            )}
                        />
                    </span>
                </form>

                {!showForm && (
                    <div className={style.listContainer}>
                        <SearchComponent />
                        <ListComponent items={questionsAnswers.map((q) => q.question)} />
                        <span className={style.buttonContainer}>
                            <ButtonComponent
                                label="Eliminar"
                                type="button"
                                danger
                                onClick={() => handleRemove(questionsAnswers)}
                            />
                        </span>
                    </div>
                )}
            </div>

            {!showForm && <AddButton onClick={() => setShowForm(true)} />}
        </div>
    );
};
