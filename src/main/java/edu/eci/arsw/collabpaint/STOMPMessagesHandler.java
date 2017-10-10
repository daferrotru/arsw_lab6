/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author danie
 */
@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;
    ConcurrentHashMap<String, ArrayList<Point>> figures = new ConcurrentHashMap<>();

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        if(figures.containsKey(numdibujo)){
            figures.get(numdibujo).add(pt);
            if(figures.get(numdibujo).size()>=3){
                msgt.convertAndSend("/topic/newpolygon."+ numdibujo, figures.get(numdibujo));
            }
        }else{
            ArrayList newFigure=new ArrayList<>();
            newFigure.add(pt);
            figures.put(numdibujo, newFigure);
        }
        //System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        //msgt.convertAndSend("/topic/newpoint."+ numdibujo, pt);
    }

}
