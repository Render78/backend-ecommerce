import TicketRepository from "../repositories/ticket.repository.js";
import logger from "../utils/logger.js";

const ticketRepository = new TicketRepository();

export const createTicket = async (req, res) => {
    const { amount, purchaser } = req.body;

    try {
        const newTicket = {
            amount,
            purchaser
        };

        const savedTicket = await ticketRepository.createTicket(newTicket);
        res.status(201).json({ status: "success", ticket: savedTicket });
    } catch (error) {
        logger.error(`Error al crear el ticket ${error.message}`);
        res.status(500).json({ error: 'Error al crear ticket' });
    }
};

export const getTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await ticketRepository.getTicketById(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        res.status(200).json({ status: "success", ticket });
    } catch (error) {
        logger.error(`Error al obtener el ticket ${error.message}`);
        res.status(500).json({ error: 'Error al obtener ticket' });
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await ticketRepository.getAllTickets();
        res.status(200).json({ status: "success", tickets });
    } catch (error) {
        logger.error(`Error al obtener los tickets ${error.message}`);
        res.status(500).json({ error: 'Error al obtener tickets' });
    }
};

export const updateTicket = async (req, res) => {
    const { id } = req.params;
    const ticketData = req.body;

    try {
        const updatedTicket = await ticketRepository.updateTicket(id, ticketData);
        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        res.status(200).json({ status: "success", ticket: updatedTicket });
    } catch (error) {
        logger.error(`Error al actualizar ticker ${error.message}`);
        res.status(500).json({ error: 'Error al actualizar ticket' });
    }
};

export const deleteTicket = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTicket = await ticketRepository.deleteTicket(id);
        if (!deletedTicket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        res.status(200).json({ status: "success", message: "Ticket eliminado" });
    } catch (error) {
        logger.error(`Error al eliminar el ticket ${error.message}`);
        res.status(500).json({ error: 'Error al eliminar ticket' });
    }
};