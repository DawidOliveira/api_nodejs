import express, {Request, Response} from 'express';
import {cpf as CPFValidator} from 'cpf-cnpj-validator';


const app = express();
const PORT = 3000;

interface ICPFData {
    cpf: string,
    description: string,
}

const cpfs: ICPFData[] = [];

app.use(express.json());

app.post('/cpf/check/', (req: Request, res: Response) => {
    const {cpf} = req.body;
    const response = CPFValidator.isValid(cpf);
    let data: ICPFData = {
        cpf,
        description: response ? 'valido' : 'invalido',
    };

    cpfs.push(data);
    return res.status(200).send();
});

app.get('/cpf/return/', (req: Request, res: Response) => {
    return res.status(200).json(cpfs);
});

app.get('/cpf/return/:cpf', (req: Request, res: Response) => {
    const {cpf} = req.params;
    const response = cpfs.filter((value) => value.cpf === cpf);
    return res.status(200).json(response);
});

app.delete('/cpf/delete/:cpf', (req: Request, res: Response) => {
    const {cpf} = req.params;
    const elements = cpfs.filter((value) => value.cpf === cpf);
    elements.forEach((value) => {
        cpfs.splice(cpfs.indexOf(value), 1);
    });
    return res.status(200).json(cpfs);
});

app.put('/cpf/update/:cpf', (req: Request, res: Response) => {
    const {cpf} = req.params;
    const {description} = req.body;

    cpfs.map((value) => {
        if(value.cpf === cpf) {
            value.description = description;
        }
    });

    return res.status(200).send();
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});