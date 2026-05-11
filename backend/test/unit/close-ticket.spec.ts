import { describe, it, expect, beforeEach } from "vitest";
import { CloseTicketUseCase } from "@/application/use-cases/close-ticket";
import { InMemoryTicketRepository } from "../repositories/in-memory-ticket-repository";
import { makeTicket } from "../factories/make-ticket";
import { makeTechnician } from "../factories/make-technician";
import { ResourceNotFoundError } from "@/application/errors/resource-not-found-error";
import { NotAllowedError } from "@/application/errors/not-allowed-error";

describe("CloseTicketUseCase", () => {
  let ticketRepository: InMemoryTicketRepository;
  let sut: CloseTicketUseCase;

  beforeEach(() => {
    ticketRepository = new InMemoryTicketRepository();
    sut = new CloseTicketUseCase(ticketRepository);
  });

  it("should close a ticket (set status to CLOSED)", async () => {
    const technician = makeTechnician();
    const ticket = makeTicket({ technicianId: technician.id });
    ticket.updateStatus("IN_PROGRESS");
    await ticketRepository.create(ticket);

    const result = await sut.execute({
      technicianId: technician.id.toString(),
      ticketId: ticket.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(ticketRepository.items[0].status.value).toBe("CLOSED");
  });

  it("should return ResourceNotFoundError if ticket does not exist", async () => {
    const result = await sut.execute({
      technicianId: "any-tech",
      ticketId: "non-existent",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should return NotAllowedError if technician is not the assigned one", async () => {
    const ticket = makeTicket();
    await ticketRepository.create(ticket);

    const result = await sut.execute({
      technicianId: "wrong-technician",
      ticketId: ticket.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
