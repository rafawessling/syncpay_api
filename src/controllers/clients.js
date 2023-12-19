const knex = require('../database/conection');

const registerClient = async (req, res) => {
    const { name, email, cpf, zip_code, address, address2, district, city, state, phone_number } = req.body;

    try {
        const emailExists = await knex('clients').select('*').where({ user_id: req.user.id, email: email }).first();
        const cpfExists = await knex('clients').select('*').where({ user_id: req.user.id, cpf: cpf }).first();

        if (cpfExists && emailExists) {
            return res
                .status(409)
                .json({ message: { cpf: 'CPF already registered', email: 'Email already registered' } });
        } else if (cpfExists) {
            return res.status(409).json({ message: { cpf: 'CPF already registered' } });
        } else if (emailExists) {
            return res.status(409).json({ message: { email: 'Email already registered' } });
        }

        let emailLowerCase = email.toLowerCase().trim();

        const [createdClient] = await knex('clients')
            .insert({
                user_id: req.user.id,
                name,
                email: emailLowerCase,
                cpf,
                zip_code,
                address,
                address2,
                district,
                state,
                city,
                phone_number,
            })
            .returning('*');

        return res.status(200).json(createdClient);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

const listClients = async (req, res) => {
const {search,status} = req.query
    
    try {
        const userId = req.user.id;
        const currentDate = new Date().toISOString().split('T')[0];

        let clients = await knex('clients')
            .distinct('clients.id')
            .select(
                'clients.*',
                knex.raw(
                    `
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM charges
                        WHERE client_id = clients.id
                          AND status = 0
                          AND due_date < ?
                    ) THEN 0
                    ELSE 1
                END AS status
            `,
                    [currentDate]
                )
            )
            .where('clients.user_id', userId);

            const filteredClients = (clients)=> { 
        
                const filterClients = clients.filter(client =>
                    client.name.toLowerCase().includes(search.toLowerCase().trim()) || 
                    client.cpf.toLowerCase().includes(search.toLowerCase().trim()) ||
                    client.email.toLowerCase().includes(search.toLowerCase().trim())
                )
                return res.status(200).json({clients: filterClients})
            }
        
        if (status === 'Pending') {
            const clientsPending = clients.filter(item => { 
            return item.status === 0});
            clients = clientsPending;
            
            if(search) {
                return filteredClients(clients);
            }
                
            return res.json({ clients });   
    
            }
        
         if (status === 'Paid') {
                const clientsPaid = clients.filter(item => { 
                return item.status === 1});
                clients = clientsPaid;
                if(search) {
                    return filteredClients(clients);
                }
                
                return res.json({ clients });
              }  
              
        
            if (search) {
                return filteredClients(clients);  
            }

            return res.json({ clients });
    
            
        }      

        
     catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    
};

}

const updateClients = async (req, res) => {
    const { name, email, cpf, phone_number, zip_code, address, address2, district, city, state } = req.body;
    const { id } = req.params;

    try {
        const registeredClient = await knex('clients').where({ id: id, user_id: req.user.id }).first();

        if (!registeredClient) {
            return res.status(404).json({ message: "Client don't exist." });
        }

        await knex('clients').where({ id: id }).update({
            name,
            email,
            cpf,
            phone_number,
            address,
            address2,
            zip_code,
            district,
            city,
            state,
        });

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

const getClient = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const client = await knex('clients').select('*').where({ user_id: userId }).andWhere({ id });
        return res.json({ client });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

const filterClients = async (req, res) => {
    const {search} = req.query
    const user_id = req.user.id

    try {
        const clients = await knex('clients').select('*').where({user_id});
        const filterClients = clients.filter(client =>
            client.name.toLowerCase().includes(search.toLowerCase().trim()) || 
            client.cpf.toLowerCase().includes(search.toLowerCase().trim()) ||
            client.email.toLowerCase().includes(search.toLowerCase().trim())
        )
        return res.status(200).json({clients: filterClients})
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
}


module.exports = {
    registerClient,
    listClients,
    updateClients,
    getClient,
    filterClients
};
