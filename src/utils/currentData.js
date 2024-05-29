import { format } from 'date-fns';

const getFullCurrentDate = () => {
    const currentD = new Date();
    const formatDate = format(currentD, 'yyyy/MM/dd HH:mm');
    const day = format(currentD, 'EEEE');

    return `${formatDate} ${day}`;
};

export { getFullCurrentDate };
