import React, { useState, useEffect } from 'react';
import { PortfolioData, UFCD, EvidenceItem, FeaturedProject } from './types';
import { loadPortfolioData, resetToDefaultData, savePortfolioData } from './utils/storage';
import { handleNewProject, handleOpenProject, handleSaveProject, resetActiveFileHandle } from './utils/eportfolioFile';
import { SidebarNav } from './components/SidebarNav';
import { TopCompactBar } from './components/TopCompactBar';
import { ManagementModal } from './components/ManagementModal';
import { SectionCover } from './components/SectionCover';
import { SectionAbout } from './components/SectionAbout';
import { SectionCourse } from './components/SectionCourse';
import { SectionTimeline } from './components/SectionTimeline';
import { SectionUFCDPages } from './components/SectionUFCDPages';
import { SectionFeaturedProjects } from './components/SectionFeaturedProjects';
import { SectionSkillEvolution } from './components/SectionSkillEvolution';
import { SectionFinalReflection } from './components/SectionFinalReflection';
import { SectionCertification } from './components/SectionCertification';
import { SectionClosure } from './components/SectionClosure';
import { EditModal } from './components/EditModal';
import { EvidenceModal } from './components/EvidenceModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { UFCDManagerModal } from './components/UFCDManagerModal';
import { SkillsManagerModal } from './components/SkillsManagerModal';
import { InterestsManagerModal } from './components/InterestsManagerModal';
import { SkillEvolutionManagerModal } from './components/SkillEvolutionManagerModal';
import { PortfolioStartPanel } from './components/PortfolioStartPanel';

export default function App() {
  const [data, setData] = useState<PortfolioData>(loadPortfolioData);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('capa');
  const [selectedUfcdId, setSelectedUfcdId] = useState<string>(data.ufcds[0]?.id || '');

  // Navigation UI State
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [isPublicPreviewMode, setIsPublicPreviewMode] = useState<boolean>(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentUfcdForEvidence, setCurrentUfcdForEvidence] = useState<string>('');
  const [editingUfcd, setEditingUfcd] = useState<UFCD | null>(null);
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);

  const loadProjectIntoView = (newData: PortfolioData) => {
    setData(newData);
    setSelectedUfcdId(newData.ufcds[0]?.id || '');
    setActiveSection('capa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createBlankPortfolio = () => {
    if (!window.confirm('Criar um portefólio em branco? O projeto atual neste navegador será substituído. Guarda primeiro uma cópia .eportfolio se o quiseres conservar.')) return;
    loadProjectIntoView(handleNewProject(data).data);
    setIsEditMode(true);
  };

  const loadExamplePortfolio = () => {
    if (!window.confirm('Abrir o exemplo da ação 26109? O projeto atual neste navegador será substituído. Guarda primeiro uma cópia .eportfolio se o quiseres conservar.')) return;
    resetActiveFileHandle();
    loadProjectIntoView(resetToDefaultData());
  };

  const openSavedPortfolio = async () => {
    const result = await handleOpenProject();
    if (result.success && result.data) loadProjectIntoView(result.data);
    else if (result.error && result.error !== 'Operação cancelada pelo utilizador.') window.alert(result.error);
  };

  // Auto-save whenever data changes
  useEffect(() => {
    savePortfolioData(data);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(nowStr);
    setHasUnsavedChanges(false);
  }, [data]);

  // Keyboard shortcut Ctrl+S or Cmd+S to save project file (.eportfolio)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        await handleSaveProject(data);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(nowStr);
        setHasUnsavedChanges(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data]);

  // Scroll spy to update active section on scroll
  useEffect(() => {
    const sectionIds = [
      'capa',
      'sobre',
      'formacao',
      'percurso',
      'ufcds',
      'trabalhos',
      'evolucao',
      'reflexao-final',
      'certificacao',
      'encerramento',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute completion percentage
  const computeCompletion = (): number => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Profile points
    totalPoints += 3;
    if (data.profile.studentName && data.profile.studentName !== 'Nome do Formando') earnedPoints += 1;
    if (data.profile.bio) earnedPoints += 1;
    if (data.profile.presentationPhrase) earnedPoints += 1;

    // Course info
    totalPoints += 2;
    if (data.course.actionNumber) earnedPoints += 1;
    if (data.course.generalObjectives) earnedPoints += 1;

    // UFCDs reflections & evidences
    data.ufcds.forEach((u) => {
      totalPoints += 3;
      if (u.whatILearned) earnedPoints += 1;
      if (u.finalReflection) earnedPoints += 1;
      if (u.evidences && u.evidences.length > 0) earnedPoints += 1;
    });

    // Final Reflection & Closure
    totalPoints += 2;
    if (data.finalReflection.overallReflection) earnedPoints += 1;
    if (data.closure.finalMessage) earnedPoints += 1;

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleUpdateSection = (sectionKey: keyof PortfolioData, values: Record<string, any>) => {
    setData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] as object),
        ...values,
      },
    }));
  };

  // Cover edit
  const handleSaveCover = (values: Record<string, any>) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        studentName: values.studentName,
        presentationPhrase: values.presentationPhrase,
        studentPhoto: values.studentPhoto,
      },
      course: {
        ...prev.course,
        actionNumber: values.actionNumber,
        actionTitle: values.actionTitle,
        entityName: values.entityName,
        startDate: values.startDate,
        endDate: values.endDate,
      },
    }));
  };

  // Evidence handlers
  const handleSaveEvidence = (ufcdId: string, evidence: Omit<EvidenceItem, 'id'>) => {
    const newEvidence: EvidenceItem = {
      ...evidence,
      id: `ev_${Date.now()}`,
    };

    setData((prev) => ({
      ...prev,
      ufcds: prev.ufcds.map((u) =>
        u.id === ufcdId
          ? { ...u, evidences: [...(u.evidences || []), newEvidence] }
          : u
      ),
    }));
  };

  const handleDeleteEvidence = (ufcdId: string, evidenceId: string) => {
    setData((prev) => ({
      ...prev,
      ufcds: prev.ufcds.map((u) =>
        u.id === ufcdId
          ? { ...u, evidences: (u.evidences || []).filter((e) => e.id !== evidenceId) }
          : u
      ),
    }));
  };

  // UFCD edit handler
  const handleSaveUfcdContent = (values: Record<string, any>) => {
    if (!editingUfcd) return;
    setData((prev) => ({
      ...prev,
      ufcds: prev.ufcds.map((u) =>
        u.id === editingUfcd.id
          ? {
              ...u,
              code: values.code || u.code,
              name: values.name || u.name,
              hours: Number(values.hours) || u.hours,
              trainer: values.trainer || u.trainer,
              whatILearned: values.whatILearned || u.whatILearned,
              activitiesDone: values.activitiesDone || u.activitiesDone,
              difficultiesFaced: values.difficultiesFaced || u.difficultiesFaced,
              howIOvercame: values.howIOvercame || u.howIOvercame,
              skillsDeveloped: values.skillsDeveloped || u.skillsDeveloped,
              finalReflection: values.finalReflection || u.finalReflection,
            }
          : u
      ),
    }));
    setEditingUfcd(null);
  };

  // Project handlers
  const handleSaveProject = (values: Record<string, any>) => {
    const isGroup = values.isGroupWork === 'sim' || values.isGroupWork === true || values.isGroupWork === 'true';

    if (editingProject) {
      // Edit existing
      setData((prev) => ({
        ...prev,
        featuredProjects: (prev.featuredProjects || []).map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                title: values.title,
                context: values.context,
                description: values.description,
                whatILearned: values.whatILearned,
                isGroupWork: isGroup,
                imageUrl: values.imageUrl,
                linkUrl: values.linkUrl,
              }
            : p
        ),
      }));
    } else {
      // Add new
      const newProj: FeaturedProject = {
        id: `proj_${Date.now()}`,
        title: values.title || 'Novo Trabalho',
        context: values.context || 'Projeto Prático',
        ufcdId: values.ufcdId || data.ufcds[0]?.id || '',
        description: values.description || '',
        whatILearned: values.whatILearned || '',
        isGroupWork: isGroup,
        imageUrl: values.imageUrl || '',
        linkUrl: values.linkUrl || '',
      };

      setData((prev) => ({
        ...prev,
        featuredProjects: [...(prev.featuredProjects || []), newProj],
      }));
    }

    setEditingProject(null);
    setActiveModal(null);
  };

  const handleDeleteProject = (projectId: string) => {
    setData((prev) => ({
      ...prev,
      featuredProjects: (prev.featuredProjects || []).filter((p) => p.id !== projectId),
    }));
  };

  // Add UFCD via UFCDManagerModal
  const handleAddUfcd = (newUfcd: Omit<UFCD, 'id' | 'evidences'>) => {
    const created: UFCD = {
      ...newUfcd,
      id: `ufcd_${Date.now()}`,
      evidences: [],
    };
    setData((prev) => ({
      ...prev,
      ufcds: [...prev.ufcds, created],
    }));
  };

  const handleDeleteUfcd = (ufcdId: string) => {
    setData((prev) => ({
      ...prev,
      ufcds: prev.ufcds.filter((u) => u.id !== ufcdId),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Left Collapsible Sidebar Navigation */}
      <SidebarNav
        data={data}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedUfcdId={selectedUfcdId}
        onSelectUfcd={setSelectedUfcdId}
        onOpenManagementModal={() => setIsManagementModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* 2. Main Body Content Area (Adjusts padding dynamically based on sidebar width) */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[230px]'
        }`}
      >
        {/* Public Preview Mode Banner */}
        {isPublicPreviewMode && (
          <div className="bg-indigo-900 text-white text-xs py-2 px-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">Pré-visualização do portefólio (apenas leitura)</span>
              <span className="opacity-75 hidden md:inline">— Esta vista não publica nem partilha os seus dados</span>
            </div>
            <button
              onClick={() => setIsPublicPreviewMode(false)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition"
            >
              Sair da pré-visualização
            </button>
          </div>
        )}

        {/* Top Compact Bar */}
        <TopCompactBar
          data={data}
          activeSection={activeSection}
          selectedUfcdId={selectedUfcdId}
          isEditMode={isPublicPreviewMode ? false : isEditMode}
          setIsEditMode={(mode) => {
            setIsEditMode(mode);
            if (mode) setIsPublicPreviewMode(false);
          }}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenManagementModal={() => setIsManagementModalOpen(true)}
          onOpenThemeModal={() => setActiveModal('theme')}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={async () => {
            await handleSaveProject(data);
            const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSavedTime(nowStr);
            setHasUnsavedChanges(false);
          }}
          lastSavedTime={lastSavedTime}
        />

        {/* Main Section Container */}
        <main className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full flex-1 ${!isEditMode || isPublicPreviewMode ? 'reading-view' : ''}`}>
          {activeSection === 'capa' && !isPublicPreviewMode && (
            <PortfolioStartPanel
              onCreateBlank={createBlankPortfolio}
              onLoadExample={loadExamplePortfolio}
              onOpenProject={openSavedPortfolio}
              onCustomize={() => setActiveModal('theme')}
            />
          )}
          
          {/* 1. Capa */}
          <SectionCover
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_cover')}
          />

          {/* 2. Sobre mim */}
          <SectionAbout
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_about')}
            onEditSkills={() => setActiveModal('edit_skills')}
            onEditInterests={() => setActiveModal('edit_interests')}
          />

          {/* 3. A minha formação */}
          <SectionCourse
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_course')}
          />

          {/* 4. O meu percurso (Linha temporal das 8 UFCD) */}
          <SectionTimeline
            data={data}
            onSelectUFCD={(ufcdId) => {
              setSelectedUfcdId(ufcdId);
              const el = document.getElementById('ufcds');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 5. Uma página por UFCD */}
          <SectionUFCDPages
            data={data}
            selectedUfcdId={selectedUfcdId}
            onSelectUfcd={setSelectedUfcdId}
            isEditMode={isEditMode}
            onEditUfcd={(ufcd) => {
              setEditingUfcd(ufcd);
              setActiveModal('edit_ufcd');
            }}
            onAddEvidence={(ufcdId) => {
              setCurrentUfcdForEvidence(ufcdId);
              setActiveModal('add_evidence');
            }}
            onDeleteEvidence={handleDeleteEvidence}
          />

          {/* 6. Projetos e trabalhos em destaque */}
          <SectionFeaturedProjects
            data={data}
            isEditMode={isEditMode}
            onAddProject={() => {
              setEditingProject(null);
              setActiveModal('edit_project');
            }}
            onEditProject={(project) => {
              setEditingProject(project);
              setActiveModal('edit_project');
            }}
            onDeleteProject={handleDeleteProject}
          />

          {/* 7. Evolução das competências */}
          <SectionSkillEvolution
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_skills_evolution')}
          />

          {/* 8. Reflexão final */}
          <SectionFinalReflection
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_final_reflection')}
          />

          {/* 9. Certificação */}
          <SectionCertification
            data={data}
          />

          {/* 10. Encerramento */}
          <SectionClosure
            data={data}
            isEditMode={isEditMode}
            onEdit={() => setActiveModal('edit_closure')}
          />
        </main>

      {/* Edit Cover Modal */}
      <EditModal
        title="Editar Capa do Portefólio"
        isOpen={activeModal === 'edit_cover'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          studentName: data.profile.studentName,
          presentationPhrase: data.profile.presentationPhrase,
          studentPhoto: data.profile.studentPhoto,
          actionNumber: data.course.actionNumber,
          actionTitle: data.course.actionTitle,
          entityName: data.course.entityName,
          startDate: data.course.startDate,
          endDate: data.course.endDate,
        }}
        fields={[
          { key: 'studentName', label: 'Nome do Formando' },
          { key: 'presentationPhrase', label: 'Frase de Apresentação', type: 'textarea', rows: 2 },
          { key: 'studentPhoto', label: 'URL da Foto do Formando' },
          { key: 'actionNumber', label: 'Número da Ação' },
          { key: 'actionTitle', label: 'Designação da Ação' },
          { key: 'entityName', label: 'Entidade Formadora' },
          { key: 'startDate', label: 'Data de Início' },
          { key: 'endDate', label: 'Data de Fim (Opcional)' },
        ]}
        onSave={handleSaveCover}
      />

      {/* Edit About Modal */}
      <EditModal
        title="Editar 'Sobre mim'"
        isOpen={activeModal === 'edit_about'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          bio: data.profile.bio,
          background: data.profile.background,
          courseObjectives: data.profile.courseObjectives,
          email: data.profile.email,
          phone: data.profile.phone,
          location: data.profile.location,
          linkedin: data.profile.linkedin,
          github: data.profile.github,
        }}
        fields={[
          { key: 'bio', label: 'Breve Apresentação', type: 'textarea', rows: 4 },
          { key: 'background', label: 'Percurso Pessoal ou Profissional', type: 'textarea', rows: 4 },
          { key: 'courseObjectives', label: 'Objetivos para a Formação', type: 'textarea', rows: 3 },
          { key: 'email', label: 'Email de Contacto (Opcional)' },
          { key: 'phone', label: 'Telefone (Opcional)' },
          { key: 'location', label: 'Localização / Cidade (Opcional)' },
          { key: 'linkedin', label: 'URL do Perfil LinkedIn (Opcional)' },
          { key: 'github', label: 'URL do GitHub (Opcional)' },
        ]}
        onSave={(values) => handleUpdateSection('profile', values)}
      />

      {/* Edit Course Modal */}
      <EditModal
        title="Editar 'A minha formação'"
        isOpen={activeModal === 'edit_course'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          actionNumber: data.course.actionNumber,
          actionTitle: data.course.actionTitle,
          entityName: data.course.entityName,
          modality: data.course.modality,
          duration: data.course.duration,
          trainerName: data.course.trainerName,
        }}
        fields={[
          { key: 'actionNumber', label: 'Número da Ação' },
          { key: 'actionTitle', label: 'Designação' },
          { key: 'entityName', label: 'Entidade Formadora' },
          { key: 'modality', label: 'Modalidade (ex: formação a distância)' },
          { key: 'duration', label: 'Duração Total (ex: 275 horas)' },
          { key: 'trainerName', label: 'Formadores (ex: Amélia Cerejo Lopes e outros formadores)' },
        ]}
        onSave={(values) => handleUpdateSection('course', values)}
      />

      {/* Edit UFCD Content Modal */}
      {editingUfcd && (
        <EditModal
          title={`Editar Conteúdo da UFCD ${editingUfcd.code}`}
          isOpen={activeModal === 'edit_ufcd'}
          onClose={() => setActiveModal(null)}
          initialValues={{
            code: editingUfcd.code,
            name: editingUfcd.name,
            hours: editingUfcd.hours,
            trainer: editingUfcd.trainer,
            whatILearned: editingUfcd.whatILearned,
            activitiesDone: editingUfcd.activitiesDone,
            difficultiesFaced: editingUfcd.difficultiesFaced,
            howIOvercame: editingUfcd.howIOvercame,
            skillsDeveloped: editingUfcd.skillsDeveloped,
            finalReflection: editingUfcd.finalReflection,
          }}
          fields={[
            { key: 'code', label: 'Código UFCD' },
            { key: 'name', label: 'Nome da UFCD' },
            { key: 'hours', label: 'Horas' },
            { key: 'trainer', label: 'Formador(a)' },
            { key: 'whatILearned', label: 'O que aprendi', type: 'textarea', rows: 3 },
            { key: 'activitiesDone', label: 'Atividades realizadas', type: 'textarea', rows: 3 },
            { key: 'difficultiesFaced', label: 'Dificuldades sentidas', type: 'textarea', rows: 2 },
            { key: 'howIOvercame', label: 'Estratégias para ultrapassar as dificuldades', type: 'textarea', rows: 2 },
            { key: 'skillsDeveloped', label: 'Competências desenvolvidas', type: 'textarea', rows: 2 },
            { key: 'finalReflection', label: 'Reflexão sobre a UFCD', type: 'textarea', rows: 3 },
          ]}
          onSave={handleSaveUfcdContent}
        />
      )}

      {/* Edit / Add Project Modal */}
      <EditModal
        title={editingProject ? 'Editar Trabalho em Destaque' : 'Adicionar Trabalho em Destaque'}
        isOpen={activeModal === 'edit_project'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          title: editingProject?.title || '',
          context: editingProject?.context || 'Trabalho de Grupo',
          description: editingProject?.description || '',
          whatILearned: editingProject?.whatILearned || '',
          isGroupWork: editingProject?.isGroupWork ? 'sim' : 'nao',
          imageUrl: editingProject?.imageUrl || '',
          linkUrl: editingProject?.linkUrl || '',
        }}
        fields={[
          { key: 'title', label: 'Nome do Trabalho' },
          { key: 'context', label: 'Contexto (ex: Trabalho da UFCD 0778)' },
          { key: 'description', label: 'O que fiz (descrição)', type: 'textarea', rows: 3 },
          { key: 'whatILearned', label: 'O que aprendi', type: 'textarea', rows: 2 },
          { key: 'isGroupWork', label: 'Trabalho de Grupo? (sim / nao)' },
          { key: 'imageUrl', label: 'URL da Imagem de Pré-visualização (Opcional)' },
          { key: 'linkUrl', label: 'Ligação para o Trabalho / Drive / GitHub (Opcional)' },
        ]}
        onSave={handleSaveProject}
      />

      {/* Edit Final Reflection Modal */}
      <EditModal
        title="Editar Reflexão Final da Ação"
        isOpen={activeModal === 'edit_final_reflection'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          overallReflection: data.finalReflection.overallReflection,
          qWhatILearned: data.finalReflection.qWhatILearned,
          qMostEvolvedArea: data.finalReflection.qMostEvolvedArea,
          qMostImportantActivity: data.finalReflection.qMostImportantActivity,
          qOvercomeDifficulties: data.finalReflection.qOvercomeDifficulties,
          qHowToApply: data.finalReflection.qHowToApply,
          qFutureLearning: data.finalReflection.qFutureLearning,
        }}
        fields={[
          { key: 'overallReflection', label: 'Balanço Global da Formação', type: 'textarea', rows: 4 },
          { key: 'qWhatILearned', label: '1. O que aprendi?', type: 'textarea', rows: 2 },
          { key: 'qMostEvolvedArea', label: '2. Em que área evoluí mais?', type: 'textarea', rows: 2 },
          { key: 'qMostImportantActivity', label: '3. Qual foi a atividade mais importante para mim?', type: 'textarea', rows: 2 },
          { key: 'qOvercomeDifficulties', label: '4. Que dificuldades consegui ultrapassar?', type: 'textarea', rows: 2 },
          { key: 'qHowToApply', label: '5. Como poderei aplicar estas aprendizagens?', type: 'textarea', rows: 2 },
          { key: 'qFutureLearning', label: '6. O que gostaria de continuar a aprender?', type: 'textarea', rows: 2 },
        ]}
        onSave={(values) => handleUpdateSection('finalReflection', values)}
      />

      {/* Edit Closure Modal */}
      <EditModal
        title="Editar Encerramento"
        isOpen={activeModal === 'edit_closure'}
        onClose={() => setActiveModal(null)}
        initialValues={{
          finalMessage: data.closure.finalMessage,
          acknowledgements: data.closure.acknowledgements,
        }}
        fields={[
          { key: 'finalMessage', label: 'Mensagem Final', type: 'textarea', rows: 3 },
          { key: 'acknowledgements', label: 'Agradecimentos', type: 'textarea', rows: 3 },
        ]}
        onSave={(values) => handleUpdateSection('closure', values)}
      />

      {/* Evidence Modal */}
      <EvidenceModal
        ufcdId={currentUfcdForEvidence}
        isOpen={activeModal === 'add_evidence'}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveEvidence}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal
        theme={data.theme}
        isOpen={activeModal === 'theme'}
        onClose={() => setActiveModal(null)}
        onSave={(newTheme) => setData((prev) => ({ ...prev, theme: newTheme }))}
      />

      {/* UFCD & Action Manager Modal */}
      <UFCDManagerModal
        data={data}
        isOpen={activeModal === 'ufcd_manager'}
        onClose={() => setActiveModal(null)}
        onSaveCourseInfo={(info) => setData((prev) => ({ ...prev, course: info }))}
        onAddUfcd={handleAddUfcd}
        onDeleteUfcd={handleDeleteUfcd}
      />

      {/* Skills Manager Modal */}
      <SkillsManagerModal
        isOpen={activeModal === 'edit_skills'}
        onClose={() => setActiveModal(null)}
        skills={data.profile.skills || []}
        onSave={(newSkills) =>
          setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, skills: newSkills },
          }))
        }
      />

      {/* Interests Manager Modal */}
      <InterestsManagerModal
        isOpen={activeModal === 'edit_interests'}
        onClose={() => setActiveModal(null)}
        interests={data.profile.interests || []}
        onSave={(newInterests) =>
          setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, interests: newInterests },
          }))
        }
      />

      {/* Skill Evolution Manager Modal */}
      <SkillEvolutionManagerModal
        isOpen={activeModal === 'edit_skills_evolution'}
        onClose={() => setActiveModal(null)}
        skillEvolutions={data.skillEvolutions || []}
        onSave={(newEvolutions) =>
          setData((prev) => ({
            ...prev,
            skillEvolutions: newEvolutions,
          }))
        }
      />

      {/* Management & Options Modal */}
      <ManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        data={data}
        onDataLoaded={loadProjectIntoView}
        onOpenThemeModal={() => setActiveModal('theme')}
        onEnterPublicPreview={() => {
          setIsEditMode(false);
          setIsPublicPreviewMode(true);
        }}
        lastSavedTime={lastSavedTime}
      />
    </div>
  </div>
  );
}
