import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './index';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
    const updateName = async (newName: string) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            await updateAuthProfile(user, { displayName: newName });

            await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), {
                name: newName,
                email: user.email,
                updatedAt: new Date(),
            }, { merge: true });

            toast.success('Nome atualizado com sucesso!');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            toast.error('Erro ao atualizar nome. Tente novamente.');
            return false;
        }
    };

    return { updateName };
};