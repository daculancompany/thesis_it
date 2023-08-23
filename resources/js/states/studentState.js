import create from "zustand";
import { createStudentAction,createThesisTitleAction, uploadFileAction } from "~/actions/studentActions";
import { PER_PAGE } from '~/utils/constant'

export const useStudentStore = create((set, get) => ({
    isSubmit: false,
    createStudent: false,
    isClear: false,
    perPage: PER_PAGE,
    students: [],
    editStudent: null,
    data: [],
    value: undefined,
    thesisDetail:null,
    title:false,
    uploadDoc: false,
    filterBy: null,
    setFilterBy: (value) => set((state) => ({ filterBy: value })),
    setTitle: (value) => set((state) => ({ title: value })),
    setClear: (value) => set((state) => ({ isClear: value })),
    setSubmit: (value) => set((state) => ({ isSubmit: value })),
    setEdit: (value) => set((state) => ({ editStudent: value })),
    setCreateStudent: (value) => set((state) => ({ createStudent: value })),
    setThesisDetails: (value) => set((state) => ({ thesisDetail: value })),
    setUploadDoc: (value) => set((state) => ({ uploadDoc: value })),
    createThesisTitle: async (params) => {
        return  await createThesisTitleAction({ params });
    },
    createNewStudent: async (params) => {
        return  await createStudentAction({ params });
    },
    image:null,
    setImage: (value) => set((state) => ({ image: value })),
    page: 0,
    setPage: (value) => set((state) => ({ page: value })),
}));

