// Content Generation Service - Automatically generates news and content from match results
import { createClient } from '@/lib/supabase/server'
import { newsService } from './news.service'
import logger from '@/lib/logger'

interface MatchData {
  match_id: string
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  match_date?: string
}

interface NewsTemplate {
  id: string
  template_type: string
  title_template: string
  content_template: string
  conditions: any
}

interface _TeamInfo {
  id: string
  name: string
  table_position: number
  points: number
}

class ContentGenerationService {
  
  // Process pending content generation requests
  async processPendingContentGeneration(): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get pending content generation requests
      const { data: pendingRequests, error } = await supabase
        .from('content_generation_log')
        .select('*')
        .eq('status', 'pending')
        .eq('generated_content_type', 'news_article')
        .order('created_at', { ascending: true })
        .limit(10)
      
      if (error) {
        logger.error('Failed to fetch pending content generation requests', { error })
        return
      }
      
      if (!pendingRequests || pendingRequests.length === 0) {
        logger.info('No pending content generation requests')
        return
      }
      
      logger.info(`Processing ${pendingRequests.length} pending content generation requests`)
      
      // Process each request
      for (const request of pendingRequests) {
        try {
          await this.processContentRequest(request)
          logger.info(`Successfully processed content request ${request.id}`)
        } catch (error) {
          logger.error(`Failed to process content request ${request.id}`, { error })
          
          // Update request status to failed
          await supabase
            .from('content_generation_log')
            .update({ 
              status: 'failed', 
              error_message: error instanceof Error ? error.message : 'Unknown error'
            })
            .eq('id', request.id)
        }
      }
      
    } catch (error) {
      logger.error('Error processing pending content generation', { error })
    }
  }
  
  // Process a single content generation request
  private async processContentRequest(request: any): Promise<void> {
    const matchData = request.trigger_data as MatchData
    
    if (!matchData || !matchData.home_team || !matchData.away_team) {
      throw new Error('Invalid match data in content generation request')
    }
    
    logger.info('Processing match result for content generation', {
      matchId: matchData.match_id,
      homeTeam: matchData.home_team,
      awayTeam: matchData.away_team,
      score: `${matchData.home_score}-${matchData.away_score}`
    })
    
    // Generate news article
    const newsArticle = await this.generateNewsFromMatch(matchData)
    
    if (newsArticle) {
      // Update the request with the generated content ID
      const supabase = await createClient()
      await supabase
        .from('content_generation_log')
        .update({ 
          status: 'completed',
          generated_content_id: newsArticle.id
        })
        .eq('id', request.id)
        
      logger.info('News article generated successfully', {
        requestId: request.id,
        newsId: newsArticle.id,
        title: newsArticle.title
      })
    }
  }
  
  // Generate news article from match data
  private async generateNewsFromMatch(matchData: MatchData): Promise<any> {
    try {
      const _supabase = await createClient()
      
      // Determine match result type and get appropriate template
      const resultType = this.determineMatchResultType(matchData)
      const template = await this.getNewsTemplate(resultType, matchData)
      
      if (!template) {
        logger.warn('No suitable news template found', { resultType, matchData })
        return null
      }
      
      // Get team information for content enrichment
      const teamInfo = await this.getTeamInfo(matchData)
      
      // Generate content from template
      const generatedContent = await this.generateContentFromTemplate(template, matchData, teamInfo)
      
      // Create news article as draft
      const newsData = {
        title: generatedContent.title,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        category: 'Spielbericht',
        is_featured: false,
        is_published: true,
        views: 0,
        author: 'Vereinsredaktion',
        tags: [matchData.home_team, matchData.away_team, 'Spielbericht']
      }
      
      // Use news service to create the article
      const newsArticle = await newsService.create(newsData)
      
      logger.info('Generated news article from template', {
        templateType: template.template_type,
        title: generatedContent.title,
        newsId: newsArticle.id
      })
      
      return newsArticle
      
    } catch (error) {
      logger.error('Error generating news from match', { matchData, error })
      throw error
    }
  }
  
  // Determine the type of match result for template selection
  private determineMatchResultType(matchData: MatchData): string {
    const { home_score, away_score, home_team } = matchData
    
    // Handle null scores
    if (home_score === null || away_score === null) {
      return 'no_result'
    }
    
    const goalDifference = Math.abs(home_score - away_score)
    
    // Check if it's our team (SV Viktoria Wertheim)
    const isHomeGame = home_team.toLowerCase().includes('viktoria') || 
                      home_team.toLowerCase().includes('sv viktoria')
    
    const weWon = (isHomeGame && home_score > away_score) || 
                  (!isHomeGame && away_score > home_score)
    const isDraw = home_score === away_score
    
    if (isDraw) {
      return 'draw'
    } else if (weWon) {
      return goalDifference >= 3 ? 'big_victory' : 'victory'
    } else {
      return 'defeat'
    }
  }
  
  // Get appropriate news template based on result type
  private async getNewsTemplate(resultType: string, _matchData: MatchData): Promise<NewsTemplate | null> {
    try {
      const supabase = await createClient()
      
      const { data: templates, error } = await supabase
        .from('news_templates')
        .select('*')
        .eq('template_type', resultType)
        .limit(1)
      
      if (error) {
        logger.error('Error fetching news template', { error, resultType })
        return null
      }
      
      return templates && templates.length > 0 ? templates[0] as NewsTemplate : null
      
    } catch (error) {
      logger.error('Error in getNewsTemplate', { error, resultType })
      return null
    }
  }
  
  // Get team information for content generation
  private async getTeamInfo(_matchData: MatchData): Promise<any> {
    try {
      const supabase = await createClient()
      
      // Get updated team positions from league table
      const { data: tableData, error } = await supabase
        .from('current_league_table')
        .select('*')
        .order('position', { ascending: true })
      
      if (error) {
        logger.error('Error fetching league table', { error })
        return null
      }
      
      // Find our team in the table
      const ourTeam = tableData?.find((team: any) => 
        team.team_name?.toLowerCase().includes('viktoria')
      )
      
      // Get next match
      const { data: nextMatch } = await supabase
        .from('upcoming_matches')
        .select('*')
        .limit(1)
        .single()
      
      return {
        ourTeam,
        nextMatch,
        leagueTable: tableData
      }
      
    } catch (error) {
      logger.error('Error getting team info', { error })
      return null
    }
  }
  
  // Generate content from template with data substitution
  private async generateContentFromTemplate(
    template: NewsTemplate, 
    matchData: MatchData, 
    teamInfo: any
  ): Promise<{ title: string; content: string; excerpt: string }> {
    
    const { home_team, away_team, home_score, away_score } = matchData
    const score = `${home_score}:${away_score}`
    
    // Determine opponent and our score
    const isHomeGame = home_team.toLowerCase().includes('viktoria')
    const opponent = isHomeGame ? away_team : home_team
    const _ourScore = isHomeGame ? home_score : away_score
    const _opponentScore = isHomeGame ? away_score : home_score
    
    // Template variables
    const variables = {
      '{score}': score,
      '{opponent}': opponent,
      '{table_position}': teamInfo?.ourTeam?.position || 'unbekannt',
      '{points}': teamInfo?.ourTeam?.points || '0',
      '{match_summary}': this.generateMatchSummary(matchData, template.template_type),
      '{next_match}': this.generateNextMatchText(teamInfo?.nextMatch)
    }
    
    // Replace variables in title and content
    let title = template.title_template
    let content = template.content_template
    
    Object.entries(variables).forEach(([placeholder, value]) => {
      title = title.replace(new RegExp(placeholder, 'g'), value.toString())
      content = content.replace(new RegExp(placeholder, 'g'), value.toString())
    })
    
    // Generate excerpt from first paragraph
    const excerpt = content.split('\n\n')[0].replace(/\*\*/g, '').substring(0, 200) + '...'
    
    return { title, content, excerpt }
  }
  
  // Generate match summary based on result type
  private generateMatchSummary(matchData: MatchData, resultType: string): string {
    const summaries = {
      'victory': 'Bereits in der ersten Halbzeit konnten wir die Weichen auf Sieg stellen. Nach der Pause verwalteten wir das Ergebnis geschickt und ließen keine gefährlichen Situationen zu.',
      'big_victory': 'Ein perfekter Auftritt unserer Mannschaft! Schon früh übernahmen wir die Kontrolle und erhöhten kontinuierlich den Druck. Die Tore fielen wie am Fließband.',
      'draw': 'Eine faire Partie auf Augenhöhe. Beide Teams hatten ihre Chancen, doch letztendlich neutralisierten sich die Kräfte. Ein Punkt, mit dem beide Seiten leben können.',
      'defeat': 'Trotz großen Einsatzes reichte es heute nicht für einen Punkt. Wir kämpften bis zum Schluss, konnten aber die wenigen Chancen nicht verwerten.'
    }
    
    return summaries[resultType as keyof typeof summaries] || 'Ein spannendes Spiel mit vielen Höhepunkten.'
  }
  
  // Generate next match text
  private generateNextMatchText(nextMatch: any): string {
    if (!nextMatch) {
      return 'Das nächste Spiel wird rechtzeitig bekannt gegeben.'
    }
    
    const date = new Date(nextMatch.match_date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',  
      day: 'numeric'
    })
    
    const time = nextMatch.match_time || '15:00'
    const opponent = nextMatch.home_team_id ? nextMatch.away_team : nextMatch.home_team
    const location = nextMatch.home_team_id ? 'Heimspiel' : `Auswärts in ${nextMatch.location || 'unbekannt'}`
    
    return `Am ${date} um ${time} Uhr treffen wir ${location} auf ${opponent}.`
  }
  
  // Manual trigger for content generation (for testing)
  async generateContentForMatch(matchId: string): Promise<void> {
    try {
      const supabase = await createClient()
      
      // Get match data
      const { data: match, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()
      
      if (error || !match) {
        throw new Error(`Match not found: ${matchId}`)
      }
      
      const matchData: MatchData = {
        match_id: match.id,
        home_team: match.home_team,
        away_team: match.away_team,
        home_score: match.home_score,
        away_score: match.away_score,
        match_date: match.match_date
      }
      
      await this.generateNewsFromMatch(matchData)
      
      logger.info('Content generation completed for match', { matchId })
      
    } catch (error) {
      logger.error('Error in manual content generation', { matchId, error })
      throw error
    }
  }
  
  // Test the content generation system
  async testContentGeneration(): Promise<boolean> {
    try {
      // Test with sample match data
      const testMatchData: MatchData = {
        match_id: 'test-123',
        home_team: 'SV Viktoria Wertheim',
        away_team: 'FC Testheim',
        home_score: 2,
        away_score: 1
      }
      
      const resultType = this.determineMatchResultType(testMatchData)
      const template = await this.getNewsTemplate(resultType, testMatchData)
      
      if (!template) {
        logger.error('No template found for test')
        return false
      }
      
      logger.info('Content generation test successful', {
        resultType,
        templateType: template.template_type
      })
      
      return true
      
    } catch (error) {
      logger.error('Content generation test failed', { error })
      return false
    }
  }
}

// Singleton instance
export const contentGenerationService = new ContentGenerationService()