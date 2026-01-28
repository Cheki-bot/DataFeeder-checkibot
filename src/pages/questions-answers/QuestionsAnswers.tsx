import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { QuestionsAnswersSchema } from './schemas/questions-answers';

import {
    AddButton,
    ButtonComponent,
    InputComponent,
    ListComponent,
    SearchComponent,
} from '@/components';

import style from './QuestionsAnswers.module.css';
import {
    createQuestionAnswer,
    deleteQuestionAnswer,
    getQuestionsAnswers,
} from './service/questions-answers.service';

import { NotificationComponent } from '@/components/notification-component/NotificationComponent';
import { useNotification } from '@/hooks/useNotification';
import type { IQuestionsAndAnswers } from '@/interfaces/QA.interface';
import { useExcel } from '@/hooks/useExcel';

export const QuestionsAnswers = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [questionsAnswers, setQuestionsAnswers] = useState<
        IQuestionsAndAnswers[]
    >([]);
    const { registerExcel, isLoading } = useExcel<IQuestionsAndAnswers>({
        requiredColumns: ['question', 'answer'],
        onSuccess: async (data) => {
            const newData = data.filter(
                (newQA) =>
                    !questionsAnswers.some(
                        (existingQA) =>
                            existingQA.question.toLowerCase() ===
                            newQA.question.toLowerCase()
                    )
            );

            for (const qa of newData) {
                await createQuestionAnswer(qa.question, qa.answer);
            }

            setQuestionsAnswers((prev) => [...prev, ...newData]);
        },
        onError: (message) => {
            console.error('Error al procesar el archivo Excel:', message);
        },
    });

    const { notifications, addNotification, removeNotification } =
        useNotification();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        resetField,
        formState: { errors },
    } = useForm<IQuestionsAndAnswers>({
        resolver: zodResolver(QuestionsAnswersSchema),
        defaultValues: {
            question: '',
            answer: '',
        },
    });

    const items = useMemo(
        () => questionsAnswers.map((q) => q.question),
        [questionsAnswers]
    );

    useEffect(() => {
        const fetchData = async () => {
            const response = await getQuestionsAnswers();
            setQuestionsAnswers(response);
        };
        fetchData();
    }, []);

    const handleAddCandidate = async (question: IQuestionsAndAnswers) => {
        await createQuestionAnswer(question.question, question.answer);
        setQuestionsAnswers((prev) => [...prev, question]);
        addNotification('Pregunta agregada correctamente', 'success'); // ✅ notificación
        reset();
    };

    const handleSelectionChange = useCallback(
        (selectedItems: { label: string }[]) => {
            setSelectedQuestions(selectedItems.map((item) => item.label));
        },
        []
    );

    const handleRemove = async () => {
        const questionsToDelete = questionsAnswers.filter((qa) =>
            selectedQuestions.includes(qa.question)
        );

        const questionsIds = questionsToDelete
            .map((q) => q._id)
            .filter((id): id is string => Boolean(id));

        if (questionsIds.length === 0) {
            addNotification(
                'No hay preguntas seleccionadas para eliminar',
                'warning'
            );
            return;
        }

        addNotification(
            `Se han eliminado las preguntas: ${questionsToDelete.map((q) => q.question).join(', ')}`,
            'success'
        );

        await deleteQuestionAnswer(questionsIds);
        setQuestionsAnswers((prev) =>
            prev.filter((q) => !questionsToDelete.includes(q))
        );
    };
    return (
        <div className={style.container}>
            {/* 🔔 Contenedor de notificaciones */}
            <div
                style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
            >
                {notifications.map((n) => (
                    <NotificationComponent
                        key={n.id}
                        id={n.id}
                        message={n.message}
                        type={n.type}
                        duration={n.duration}
                        onClose={removeNotification}
                    />
                ))}
            </div>

            <div className={style.uploadButton}>
                <ButtonComponent light label="Subir Excel" onClick={() => {}} />
            </div>

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
                    <div className={style.checkboxField}></div>
                    <InputComponent
                        label="Pregunta"
                        type="text"
                        value={watch('question')}
                        validationProps={register('question')}
                        errors={errors.question}
                        onClear={() => resetField('question')}
                    />
                    <InputComponent
                        label="Respuesta"
                        type="text"
                        value={watch('answer')}
                        validationProps={register('answer')}
                        errors={errors.answer}
                        onClear={() => resetField('answer')}
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
                        <SearchComponent
                            data={items.map((question) => ({
                                label: question,
                            }))}
                            searchKeys={['label']}
                            hasDropdown
                        />
                        <ListComponent
                            items={items.map((question) => ({
                                label: question,
                            }))}
                            onSelectionChange={handleSelectionChange}
                        />
                        <span className={style.buttonContainer}>
                            <ButtonComponent
                                label="Eliminar"
                                type="button"
                                danger
                                onClick={handleRemove}
                            />
                        </span>
                    </div>
                )}
            </div>

            {!showForm && <AddButton onClick={() => setShowForm(true)} />}
        </div>
    );
};
