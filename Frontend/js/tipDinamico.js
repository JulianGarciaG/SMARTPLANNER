(function(){
    const tips = [
        'Planifica tu día la noche anterior para empezar con claridad.',
        'Agrupa tareas similares para reducir cambios de contexto.',
        'Asigna un presupuesto semanal y revisa tus gastos a diario.',
        'Usa la regla 50/30/20 para balancear necesidades, deseos y ahorro.',
        'Bloques de tiempo de 25 minutos (Pomodoro) mejoran tu enfoque.',
        'Registra pequeños gastos: los centavos diarios suman al mes.',
        'Prioriza tres tareas clave al día y complétalas primero.',
        'Automatiza pagos recurrentes para evitar moras y olvidos.',
        'Divide metas grandes en pasos pequeños y medibles.',
        'Revisa tu calendario financiero el mismo día cada semana.'
    ];
    const tipEl = document.getElementById('tip-del-dia');
    if (tipEl) {
        const idx = Math.floor(Math.random()*tips.length);
        tipEl.textContent = tips[idx];
    }
})();