const knex = require("../database/conection");

const registerCharges = async (req, res) => {
    const { description, due_date, value, status } = req.body;
    const client_id = req.params.id

    try {
        const verifyUser = await knex('clients').select('*').where({ user_id: req.user.id, id: client_id }).first()
        if (verifyUser) {
            const createdCharge = await knex('charges').insert({ description, due_date, value, status, client_id, user_id: req.user.id }).returning('*');
            return res.json({ createdCharge })
        }

        return res.status(401).json({ message: 'not authorized' })

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
}



const getCharges = async (req, res) => {
    const {search, status} = req.query
    const currentDate = new Date()
    
    try {

        const filterCharges = (charges)=> { 
            const filterCharges = charges.filter(charge =>
                charge.client_name.toLowerCase().includes(search.toLowerCase().trim()) || 
                charge.id.toLowerCase().includes(search.toLowerCase().trim())
            )
            return res.status(200).json({charges: filterCharges})
        
        }
        
        if (status === 'Defeated') {
            const charges = await knex
            .select('charges.*', 'clients.name as client_name')
            .from('charges') 
            .where( 'charges.user_id', req.user.id )
            .join('clients', 'charges.client_id', 'clients.id')
            .where('status', 0)
            .where('due_date', '<', currentDate);
            if (search)  {
               return filterCharges(charges); 
            }
           
            return res.json({charges});
        }

        else if (status === 'Expected')  {
            const charges = await knex
            .select('charges.*', 'clients.name as client_name')
            .from('charges') 
            .where( 'charges.user_id', req.user.id )
            .join('clients', 'charges.client_id', 'clients.id')
            .where('status', 0)
            .where('due_date', '>', currentDate);
            if (search)  {
               return filterCharges(charges); 
             }
            return res.json({charges});
        }

        else if(status === 'Paid') {
            const charges = await knex
            .select('charges.*', 'clients.name as client_name')
            .from('charges')
            .where( 'charges.user_id', req.user.id )
            .join('clients', 'charges.client_id', 'clients.id')
            .where('status', 1);
            if (search)  {
                return filterCharges(charges); 
             }
           return res.json({charges});
        }
        
        else { 
            const charges = await knex('charges')
            .where( 'charges.user_id', req.user.id )
            .join('clients', 'charges.client_id', 'clients.id')
            .select('charges.*', 'clients.name as client_name')
            .returning('*');
            if (search)  {
                return filterCharges(charges); 
            }
            return res.json({charges});
        }

        


    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
}

const listChargesClient = async (req, res) => {
    const client_id = req.params.id

    try {
        const charges= await knex('charges')
        .where( 'charges.user_id', req.user.id )
        .andWhere('charges.client_id', client_id)
        .join('clients', 'charges.client_id', 'clients.id')
        .select('charges.*', 'clients.name as client_name')
        .returning('*');

        if (!charges) {

            return res.status(404).json({ message: "Charges not found" });
        }

        return res.json({ charges });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
}

const getChargeDetails = async (req, res) => {
    const chargeId = req.params.id;

    try {
        const charge = await knex('charges')
            .where({ id: chargeId, user_id: req.user.id })
            .first();

        if (!charge) {
            return res.status(404).json({ message: 'Charge not found' });
        }

        return res.json({ charge });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};


const updateCharge = async (req, res) => {
    const chargeId = req.params.id;
    const { description, status, value, due_date } = req.body;

    try {
        const existingCharge = await knex('charges')
            .where({ id: chargeId, user_id: req.user.id })
            .first();

        if (!existingCharge) {
            return res.status(404).json({ message: 'Charge not found' });
        }

        if (!description || !value || !due_date) {
            return res.status(400).json({ message: 'All fields marked with * are required' });
        }

        const updatedCharge = await knex('charges')
            .where({ id: chargeId })
            .update({ description, status, value, due_date })
            .returning('*');

        return res.json({ updatedCharge, message: 'Charge updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

const deleteCharge = async (req, res) => {
    const chargeId = req.params.id;

    try {
        const charge = await knex('charges')
            .where({ id: chargeId, user_id: req.user.id })
            .first();

        if (!charge) {
            return res.status(404).json({ message: 'Charge not found' });
        }

        const currentDate = new Date();
        const dueDate = new Date(charge.due_date);

        if (charge.status !== 0 || dueDate < currentDate) {
            return res.status(400).json({ message: 'Cannot delete this charge. Check status and due date.' });
        }

        await knex('charges')
            .where({ id: chargeId })
            .del();

        return res.json({ message: 'Charge deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};


module.exports = {
    registerCharges,
    getCharges,
    listChargesClient,
    getChargeDetails,
    updateCharge,
    deleteCharge,
}
