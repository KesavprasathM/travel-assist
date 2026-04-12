package com.travel.service;
import com.travel.model.Destination;
import com.travel.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DestinationService {
    private final DestinationRepository repo;
    public DestinationService(DestinationRepository r) { repo = r; }
    public List<Destination> getAll() { return repo.findAll(); }
    public Destination getById(Long id) { return repo.findById(id).orElseThrow(); }
    public Destination getByName(String name) { return repo.findByNameIgnoreCase(name).orElseThrow(); }
    public List<Destination> search(String q) { return repo.searchDestinations(q); }
    public List<Destination> getTopRated() { return repo.findTopRated(); }
    public List<Destination> getByType(String type) { return repo.findByTypeIgnoreCase(type); }
}
