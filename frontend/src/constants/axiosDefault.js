export const reqhead = {headers: {'Content-Type': 'application/json'}};

export const token = () => {
    const tk = localStorage.getItem('token')
    return tk ? {headers: {Authorization: `Token ${tk}`}} : null;
}