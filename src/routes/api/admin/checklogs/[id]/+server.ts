import { json, type RequestHandler } from '@sveltejs/kit';
import { graphqlClient } from '$lib/server/graphql';

const DELETE_CHECKLOG = `
  mutation DeleteCheckLog($id: uuid!) {
    delete_CheckLog_by_pk(id: $id) {
      id
    }
  }
`;

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check if user has full admin access
  if (!locals.user || locals.user.role !== 'admin' || locals.user.type !== 'full') {
    return json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  try {
    const { id } = params;
    
    if (!id) {
      return json({ error: 'Check log ID is required' }, { status: 400 });
    }
    
    // Delete the check log
    const result: any = await graphqlClient.request(DELETE_CHECKLOG, { id });
    
    if (result.delete_CheckLog_by_pk) {
      return json({ success: true });
    } else {
      return json({ error: 'Check log not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete check log error:', error);
    return json({ error: 'Failed to delete check log' }, { status: 500 });
  }
}; 