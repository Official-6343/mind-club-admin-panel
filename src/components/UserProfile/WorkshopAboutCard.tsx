import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import FileInput from "../form/input/FileInput";
import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { updateWorkshop, updateWorkshopabout } from "../../store/workshopSlice";
import { AppDispatch } from "../../store/store";
import { updateWorkshopaboutApi } from "../../api/workshopApi";

interface WorkshopaboutCardProps {
    about: any; // Replace 'any' with your actual about type if available
    workshopId: string;
}

export default function WorkshopaboutCard({ about, workshopId }: WorkshopaboutCardProps) {
    const { isOpen, openModal, closeModal } = useModal();

    // State for form fields
    const [form, setForm] = useState({
        title: about?.title || "",
        description: about?.description || "",
        workshopVisual: about?.workshopVisual ? [...about.workshopVisual.map((v: any) => ({ ...v, imageOrVideo: { ...v.imageOrVideo } }))] : []
    });

    const dispatch = useDispatch<AppDispatch>();

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle file input (for image and watchTrailer)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    // Change a field in a workshopVisual item
    const handleVisualChange = (index: number, field: string, value: any) => {
        setForm(prev => {
            const updated = [...prev.workshopVisual];
            if (field === "imageOrVideo.url") {
                updated[index].imageOrVideo.url = value;
            } else {
                updated[index][field] = value;
            }
            return { ...prev, workshopVisual: updated };
        });
    };

    // Handle file input for imageOrVideo.url
    const handleVisualFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleVisualChange(index, "imageOrVideo.url", reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Add a new workshopVisual item
    const handleAddVisual = (e) => {
        e.preventDefault()
        setForm(prev => ({
            ...prev,
            workshopVisual: [
                ...prev.workshopVisual,
                {
                    name: "",
                    description: "",
                    imageOrVideo: { url: "" }
                }
            ]
        }));
    };

    // Remove a workshopVisual item
    const handleRemoveVisual = (index: number) => {
        setForm(prev => ({
            ...prev,
            workshopVisual: prev.workshopVisual.filter((_, i) => i !== index)
        }));
    };

    // Save handler
    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(updateWorkshop({
                id: workshopId,
                workshopData: { about: form },
            })).unwrap();
            closeModal();
        } catch (err) {
            alert("Failed to update workshop");
        }
    };

    console.log(about, "about")
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                About
              </h4>
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full  xl:flex-row gap-10">

                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {about?.title}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {about?.description}
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        Edit
                    </button>
                </div>
                {/* Responsive grid for workshopVisual cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
                                {about?.workshopVisual && about.workshopVisual.map((value: any, index: number) => (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col" key={index}>
                                        <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                                            {value.imageOrVideo?.url && (
                                                <img className="object-cover h-full w-full" src={value.imageOrVideo.url} alt={value?.name || ''} />
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{value?.name}</h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{value?.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit about
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your about up-to-date.
                        </p>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div>
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    About workshop (Section 2)
                                </h5>

                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <TextArea
                                            value={form.description}
                                            onChange={val => setForm({ ...form, description: val })}
                                        />
                                    </div>
                                    {/* Editable grid for workshopVisual */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full">
                                        {form.workshopVisual.map((value, index) => (
                                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col" key={index}>
                                                <div className="w-full h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                                                    {value.imageOrVideo.url && (
                                                        <img src={value.imageOrVideo.url} alt="" className="object-cover h-full w-full" />
                                                    )}
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col gap-2">
                                                    <Label>Name</Label>
                                                    <Input
                                                        type="text"
                                                        value={value.name}
                                                        onChange={e => handleVisualChange(index, "name", e.target.value)}
                                                    />
                                                    <Label>Description</Label>
                                                    <Input
                                                        type="text"
                                                        value={value.description}
                                                        onChange={e => handleVisualChange(index, "description", e.target.value)}
                                                    />
                                                    <Label>Image/Video</Label>
                                                    <input
                                                        type="file"
                                                        accept="image/*,video/*"
                                                        onChange={e => handleVisualFileChange(index, e)}
                                                    />
                                                    <Button size="sm" variant="outline" onClick={() => handleRemoveVisual(index)}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button size="sm" onClick={(e)=>handleAddVisual(e)} className="mt-4">
                                        Add Visual
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={e => handleSave(e as unknown as FormEvent)}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
